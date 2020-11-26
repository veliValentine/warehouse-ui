import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JsxParser from 'react-jsx-parser';

import Table from './components/Table';
import { FixedSizeGrid as WindowList } from 'react-window';

const baseURI = 'https://bad-api-assignment.reaktor.com';

const ReadAvailability = ({ children }) => children;

const App = () => {
  const [product, setProduct] = useState('shirts');
  const [productData, setProductData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [data, setData] = useState(null);

  //console.log({ productData });
  //console.log({ availabilityData });
  console.log({ data });
  console.log('main');

  const getProduct = () => {
    return axios.get(`${baseURI}/products/${product}`);
  };

  const getAvailability = (availability) => {
    //console.log('getAvailability');
    return axios.get(`${baseURI}/availability/${availability}`
      //, { headers: { 'x-force-error-mode': 'all' } }
    );
  };

  useEffect(() => {
    if (productData) {
      console.log('toka effect');
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

  useEffect(() => {
    console.log('eka effect');
    getProduct()
      .then(({ data }) => {
        setProductData(data);
        setData(data.map(item => ({
          0: item.name,
          1: item.manufacturer,
          2: item.color,
          3: item.price,
          4: 'loading...'
        })));
      });
  }, [product]);


  useEffect(() => {
    if (availabilityData) {
      console.log('kolmas effect');
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
          4: <JsxParser components={{ AVAILABILITY: ReadAvailability, INSTOCKVALUE: ReadAvailability }} jsx={manufacturer.availability} />,
          id: product.id,
          type: product.type,
        };
        return completeProduct;
      });
      setData(productWithAvailability);
    }
  }, [availabilityData]);

  const buttons = () => {
    const buttons = [
      <button key={'jackets'} onClick={() => setProduct('jackets')}>Jackets</button>,
      <button key={'shirts'} onClick={() => setProduct('shirts')}>Shirts</button>,
      <button key={'accessories'} onClick={() => setProduct('accessories')}>Accessories</button>,
    ];

    return buttons.filter(button => button.key !== product);
  };

  return (
    <div>
      <h1>Welcome!</h1>
      {buttons()}
      <h2>{product}</h2>
      {!data ? null :
        <WindowList
          height={500}
          width={600}
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

const Row = ({ style, columnIndex, rowIndex, data }) => {
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