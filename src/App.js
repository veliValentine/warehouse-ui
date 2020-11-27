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
  const [search, setSearch] = useState('');

  //get product from server
  useEffect(() => {
    if (finalData && finalData[product]) {
      //set data if already fetched from server
      setData(finalData[product]);
    } else {
      //get product data from server
      service.getProduct(product)
        .then(({ data }) => {
          const newData = data.map(item => {
            const manufacturer = item.manufacturer;
            let availability;
            if (availabilityData && availabilityData[manufacturer]) {
              //See if availability information already exsists
              availability = availabilityData[manufacturer].find(obj => item.id === obj.id);
            }
            return ({
              0: item.name,
              1: manufacturer,
              2: item.color.join(' '),
              3: item.price,
              4: availability ? availability.availability : 'loading...',
              ...item,
            });
          });
          setProductData(newData); //Used to get availability information
          setData(newData); //Data is used to render data
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
              //See if data send by server is what we want
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
        .finally(() => setAvailabilityData(manufacturerData));//Save availability data
    }
  }, [productData]);

  //join manufacturer data with product data
  useEffect(() => {
    if (availabilityData) {
      const allAvailabilityIds = Object.keys(availabilityData)
        .reduce((arr, manufacturer) => {
          return [...arr, ...availabilityData[manufacturer]];
        }, [])
        .map(item => item.id);
      //commond IDs is list of product IDs that have availability data available
      const commonIds = productData.filter(({ id }) => allAvailabilityIds.includes(id)).map(item => item.id);
      const productWithAvailability = commonIds.map(id => {
        //create new product object with availability data
        const product = productData.find(item => item.id === id);
        const manufacturer = availabilityData[product.manufacturer].find(item => item.id === id);
        if (product.color !== 'string') {
          product.color = product.color.join(' ');
        }
        return {
          0: product.name,
          1: product.manufacturer,
          2: product.color,
          3: product.price,
          4: manufacturer.availability,
          id: product.id,
          type: product.type,
        };
      });
      //get products without availability information
      const productsWithoutAvailability = productData.filter(({ id }) => !commonIds.includes(id));
      //save all product information
      const newData = [...productWithAvailability, ...productsWithoutAvailability];
      setData(newData);//render new data
      const newFinalData = finalData;
      newFinalData[newData[0].type] = newData;
      setFinalData(newFinalData); //saved for later use
    }
  }, [availabilityData]);


  const gridRef = React.createRef();

  const goTo = () => {
    if (search.trim() === '') {
      return null;
    }
    //hunkox rain 1
    //HUNKOX RAIN BRIGHT 18
    if (data) {
      const filteredData = data.filter(item => item[0].toLowerCase().includes(search.toLowerCase().trim()));
      const l = filteredData.length;
      if (l < 1) {
        return 'No results';
      }
      if (l > 10) {
        return 'Too many results!';
      }
      //console.log(data.map(item => item[0]).indexOf(m[0]));
      return filteredData.map((item) => {
        const name = item[0];
        const i = data.indexOf(item);
        return (
          <button
            key={name}
            onClick={() => gridRef.current.scrollToItem({
              columnIndex: 0,
              rowIndex: i + 1,
              align: 'start'
            })}
          >
            {`${name} @ row ${i + 1}`}
          </button>
        );
      });
    }
  };
  return (
    <div>
      <h1>Welcome!</h1>
      <Buttons setProduct={setProduct} />
      <ErrorComponent message={error} />
      <div>
        <h2>{title(product)}</h2>
        <form>
          <input
            id='searchInput'
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            placeholder={'Filter by product by name'}
          />
        </form>
        <p>{goTo()}</p>
        {!data || data[0].type !== product ? 'loading...' :
          <div>
            <p>{data.length} {product} in database</p>

            <WindowList
              height={50 * 50}
              width={screen.width - 50}
              columnCount={5}
              columnWidth={screen.width > 600 ? (screen.width - 70) / 5 : 150}
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
              ref={gridRef}
            >
              {Row}
            </WindowList>
          </div>
        }
      </div>
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