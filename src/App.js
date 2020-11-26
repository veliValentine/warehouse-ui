import React, { useState, useEffect } from 'react';
import JsxParser from 'react-jsx-parser';

import { title, Availability, Instockvalue, ErrorComponent, newError } from './misc';
import service from './service/service';

import { FixedSizeGrid as WindowList } from 'react-window';
import Buttons from './components/Buttons';

const App = () => {
  const [product, setProduct] = useState('shirts');
  const [productData, setProductData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [data, setData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [error, setError] = useState(null);

  //get product from server
  useEffect(() => {
    if (finalData && finalData[product]) {
      setData(finalData[product]);
    } else {
      service.getProduct(product)
        .then(({ data }) => {
          const newData = data.map(item => {
            const manufacturer = item.manufacturer;
            let availability;
            if (availabilityData && availabilityData[manufacturer]) {
              availability = availabilityData[manufacturer].find(obj => item.id === obj.id);
            }
            return ({
              0: item.name,
              1: manufacturer,
              2: item.color,
              3: item.price,
              4: availability ? availability.availability : 'loading...',
              ...item,
            });
          });
          setProductData(newData);
          setData(newData);
        })
        .catch(e => {
          if (e instanceof Error) {
            console.error(e.message);
            newError('Failed to get product information', error, setError);
          }
        });
    }
  }, [product]);


  //get manufacturer data from server
  useEffect(() => {
    if (productData) {
      // Hae muuttujaan jo olemassa olvea data ja filtteröi haettavista merkeistä jo olemassa olevat
      let manufacturerData = [];
      let uniqueManufacturer = productData
        .map(product => product.manufacturer)
        .filter((v, i, s) => s.indexOf(v) === i);

      if (availabilityData) {
        //Won't get availability data from server if we already have it!
        const keys = Object.keys(availabilityData);
        uniqueManufacturer = uniqueManufacturer.filter(item => !keys.includes(item));
      }
      Promise.all(uniqueManufacturer
        .map(uniqueManufacturer => service.getAvailability(uniqueManufacturer)))
        .then(responses => {
          responses.forEach((response, index) => {
            const manufacturer = uniqueManufacturer[index];
            const responseData = response.data.response;
            if (typeof responseData === 'object') {
              //tallenna data
              manufacturerData[manufacturer] = responseData.map(item => ({
                id: item.id.toLowerCase(),
                availability: <JsxParser components={{ AVAILABILITY: Availability, INSTOCKVALUE: Instockvalue }} jsx={item.DATAPAYLOAD.trim()} />
              }));
            } else {
              console.error(`server failed to get data for ${manufacturer}`);
            }
          });
        })
        .catch(e => {
          if (e instanceof Error) {
            console.error(e.message);
            newError('Failed to contact availability server', error, setError);
          }
        })
        .finally(() => setAvailabilityData(manufacturerData));
    }
  }, [productData]);

  //join manufacturer data with product data
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
        return {
          0: product.name,
          1: product.manufacturer,
          2: product.color.join(' '),
          3: product.price,
          4: manufacturer.availability,
          id: product.id,
          type: product.type,
        };
      });
      const productsWithoutAvailability = productData.filter(({ id }) => !commonIds.includes(id));
      const newData = [...productWithAvailability, ...productsWithoutAvailability];
      setData(newData);
      const newFinalData = finalData;
      newFinalData[newData[0].type] = newData;
      setFinalData(newFinalData);
    }
  }, [availabilityData]);

  return (
    <div>
      <h1>Welcome!</h1>
      <Buttons setProduct={setProduct} />
      <ErrorComponent message={error} />
      {!data || data[0].type !== product ? 'loading...' :
        <div>
          <h2>{title(product)}</h2>
          <p>{data.length} {product} in database</p>
          <WindowList
            height={50 * 50}
            width={screen.width - 50}
            columnCount={5}
            columnWidth={(screen.width - 70) / 5}
            rowHeight={50}
            rowCount={data.length + 1}
            overscanRowCount={50}
            itemData={[{
              0: 'Name',
              1: 'Manufacturer',
              2: 'Color',
              3: 'Price',
              4: 'Availability'
            }].concat(data)}
          >
            {Row}
          </WindowList>
        </div>
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
      {columnIndex !== 0 || rowIndex === 0 ? <div style={{ padding: 5 }}>{item[columnIndex]}</div> :
        <div style={{ padding: 5 }}>{rowIndex + ' ' + item[columnIndex]}</div>
      }
    </div>
  );
};

export default App;