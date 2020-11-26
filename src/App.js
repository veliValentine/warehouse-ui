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

  const getProduct = () => {
    return axios.get(`${baseURI}/products/${product}`);
  };

  const getAvailability = (availability) => {
    //console.log('getAvailability');
    return axios.get(`${baseURI}/availability/${availability}`
      //, { headers: { 'x-force-error-mode': 'all' } }
    );
  };

  //get product from server
  useEffect(() => {
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
      setData([...productWithAvailability, ...productsWithoutAvailability]);
    }
  }, [availabilityData]);

  return (
    <div>
      <h1>Welcome!</h1>
      <Buttons setProduct={setProduct} />
      <h2>{title(product)}</h2>

      {!data || data[0].type !== product ? 'loading...' :
        <WindowList
          height={screen.height - 200}
          width={500}
          columnCount={5}
          columnWidth={100}
          rowHeight={50}
          rowCount={data.length}
          itemData={data}
          style={{ borderBottomWidth: 1 }}
        >
          {Row}
        </WindowList>
      }
    </div >
  );
};

export const Row = ({ style, columnIndex, rowIndex, data }) => {
  const item = data[rowIndex];
  /*
  item {
    0: name
    1: manufacturer
    2: color
    3: price
    4: availability
  }
  */
  return (
    <div style={{ ...style, borderBottomWidth: 1 }}>
      {item[columnIndex]}
    </div>
  );
};

export default App;