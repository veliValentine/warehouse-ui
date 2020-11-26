import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JsxParser from 'react-jsx-parser';

import { title, Availability, Instockvalue } from './misc';

import { FixedSizeGrid as WindowList } from 'react-window';
import Buttons from './components/Buttons';

const baseURI = 'https://bad-api-assignment.reaktor.com';

const App = () => {
  const [product, setProduct] = useState('shirts');
  const [productData, setProductData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [data, setData] = useState(null);
  const [finalData, setFinalData] = useState([]);

  const getProduct = () => {
    return axios.get(`${baseURI}/products/${product}`);
  };

  const getAvailability = (availability) => {
    //console.log('getAvailability');
    return axios.get(`${baseURI}/availability/${availability}`
      , { headers: { 'x-force-error-mode': 'all' } }
    );
  };

  //get product from server
  useEffect(() => {
    if (finalData && finalData[product]) {
      console.log('from final data');
      setData(finalData[product]);
    } else {
      getProduct()
        .then(({ data }) => {
          const newData = data.map(item => ({
            0: item.name,
            1: item.manufacturer,
            2: item.color,
            3: item.price,
            4: 'loading...',
            ...item,
          }));
          setProductData(newData);
          setData(newData);
        });
    }
  }, [product]);


  //get manufacturer data from server
  useEffect(() => {
    if (productData) {
      // Hae muuttujaan jo olemassa olvea data ja filtteröi haettavista merkeistä jo olemassa olevat
      let manufacturerData = [];
      const uniqueManufacturer = productData
        .map(product => product.manufacturer)
        .filter((v, i, s) => s.indexOf(v) === i);
      Promise.all(uniqueManufacturer
        .map(uniqueManufacturer => getAvailability(uniqueManufacturer)))
        .then(responses => {
          responses.forEach((response, index) => {
            const manufacturer = uniqueManufacturer[index];
            const responseData = response.data.response;
            if (typeof responseData === 'object') {
              //tallenna data
              manufacturerData[manufacturer] = responseData.map(item => ({
                id: item.id.toLowerCase(),
                availability: item.DATAPAYLOAD
              }));
            } else {
              console.error(`server failed to get data for ${manufacturer}`);
            }
          });
        })
        .finally(() => setAvailabilityData(manufacturerData));
    }
  }, [productData]);

  //join manufactuer data with product data
  useEffect(() => {
    if (availabilityData) {
      const allAvailabilityData = Object.keys(availabilityData)
        .reduce((arr, manufacturer) => {
          return [...arr, ...availabilityData[manufacturer]];
        }, [])
        .map(item => item.id);
      const commonIds = productData.filter(({ id }) => allAvailabilityData.includes(id)).map(item => item.id);
      const productWithAvailability = commonIds.map(id => {
        const product = productData.find(item => item.id === id);
        const manufacturer = availabilityData[product.manufacturer].find(item => item.id === id);
        const completeProduct = {
          0: product.name,
          1: product.manufacturer,
          2: product.color.join(' '),
          3: product.price,
          4: <JsxParser components={{ AVAILABILITY: Availability, INSTOCKVALUE: Instockvalue }} jsx={manufacturer.availability.trim()} />,
          id: product.id,
          type: product.type,
        };
        return completeProduct;
      });
      const productsWithoutAvailability = productData.filter(({ id }) => !commonIds.includes(id));
      const newData = [...productWithAvailability, ...productsWithoutAvailability];
      setData(newData);
      const newFinalData = finalData;
      newFinalData[newData[0].type] = newData;
      setFinalData(newFinalData);
    }
  }, [availabilityData]);

  if (data) {
    console.log(product, data[0].type);
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <Buttons setProduct={setProduct} />
      <h2>{title(product)}</h2>

      {!data || data[0].type !== product ? 'loading...' :
        <WindowList
          height={screen.height - 200}
          width={screen.width}
          columnCount={5}
          columnWidth={(screen.width - 50) / 5}
          rowHeight={50}
          rowCount={data.length + 1}
          itemData={[{
            0: 'Name',
            1: 'manufacturer',
            2: 'Color',
            3: 'Price',
            4: 'Availability'
          }].concat(data)}
        >
          {Row}
        </WindowList>
      }
    </div >
  );
};

const Row = ({ style, columnIndex, rowIndex, data }) => {
  const item = data[rowIndex];

  if (rowIndex === 0) {
    style = {
      ...style,
      fontWeight: 'bold',
      fontSize: 'larger',
    };
  }
  return (
    <div style={{ ...style, border: 'thin solid black' }}>
      {columnIndex !== 0 || rowIndex === 0 ? item[columnIndex] :
        rowIndex + ' ' + item[columnIndex]
      }
    </div>
  );
};

export default App;