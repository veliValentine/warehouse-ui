import React, { useState, useEffect } from 'react';

import { title, newError, uniqueManufacturer, arrayKeys, pareseAvailabilityData } from './misc';
import service from './service/service';

import Buttons from './components/Buttons';
import Table from './components/Table';
import ErrorComponent from './components/Error';
import SearchFormButtons from './components/SearchFormButtons';
import Footer from './components/Footer';

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
      //set data if already fetched from server
      setData(finalData[product]);
      setProductData(finalData[product]);
    } else {
      //get product data from server
      service.getProduct(product)
        .then(({ data }) => {
          const newData = data.map(item => {
            const manufacturer = item.manufacturer;
            let availability;

            //See if availability information already exsists
            if (availabilityData && availabilityData[manufacturer]) {
              availability = availabilityData[manufacturer].find(obj => item.id === obj.id);
            }
            return ({
              0: item.name,
              1: manufacturer,
              2: item.color.join(' '),
              3: item.price,
              4: availability ? availability.availability : 'loading...',
              id: item.id,
              type: item.type,
              manufacturer: item.manufacturer,
            });
          });
          setProductData(newData); //Used to get availability information
          setData(newData); //Data is used to render data
        })
        .catch(e => {
          if (e instanceof Error) {
            console.error(e.name, e.message);
            newError('Failed to get product information', setError);
          }
        });
    }
  }, [product]);


  //get manufacturer data from server
  useEffect(() => {
    if (productData) {
      let manufacturerData = [];
      let uniqueMan = uniqueManufacturer(productData);
      if (availabilityData) {
        //Won't get availability data from server if we already have it!
        const keys = arrayKeys(availabilityData);
        keys.forEach(key => {
          manufacturerData[key] = availabilityData[key];
        });
        uniqueMan = uniqueMan.filter(item => !keys.includes(item));
      }
      Promise.all(uniqueMan
        .map(uniqueManufacturer => service.getAvailability(uniqueManufacturer))
      ).then(responses => {
        responses.forEach((response, index) => {
          const manufacturer = uniqueMan[index];
          const responseData = response.data.response;

          //See if data sent by server is what we want
          if (typeof responseData === 'object') {
            manufacturerData[manufacturer] = pareseAvailabilityData(responseData);
          } else {
            newError(`Server failed to get data for ${manufacturer}`, setError);
          }
        });
      })
        .catch(e => {
          if (e instanceof Error) {
            console.error(e.name, e.message);
            newError('Failed to contact availability server', setError);
          }
        })
        .finally(() => setAvailabilityData(manufacturerData));//Save availability data
    }
  }, [productData]);

  //join manufacturer data with product data
  useEffect(() => {
    if (availabilityData) {
      //get all manufacturer IDs
      const allAvailabilityIds = arrayKeys(availabilityData)
        .reduce((arr, manufacturer) => {
          return [...arr, ...availabilityData[manufacturer]];
        }, [])
        .map(item => item.id);

      //commond IDs is list of product IDs that have manufacturer data available
      const commonIds = productData
        .filter(({ id }) => allAvailabilityIds.includes(id))
        .map(item => item.id);

      const productWithAvailability = commonIds.map(id => {
        //create new product object with availability data
        const product = productData.find(item => item.id === id);
        const manufacturer = availabilityData[product.manufacturer].find(item => item.id === id);
        if (typeof product[2] === 'object') {
          product[2] = product[2].join(' ');
        }
        return {
          //join product data with manufacturer availability data
          ...product,
          4: manufacturer.availability,
        };
      });
      //get products without availability information and add reload button
      const productsWithoutAvailability = productData
        .filter(({ id }) => !commonIds.includes(id))
        .map(item => ({
          ...item,
          4: <button onClick={() => reload(item.manufacturer)}>Reload</button>
        }));
      //render new data
      let newData = [];
      newData = [...productWithAvailability, ...productsWithoutAvailability];
      if (product === newData[0].type) {
        setData([].concat(newData));
      }
      //save all product information
      const newFinalData = finalData;
      newFinalData[newData[0].type] = newData;
      setFinalData(newFinalData); //saved for later use
      setProduct(''.concat(product));
    }
  }, [availabilityData]);

  //used by reload button to refetch availability data from server
  const reload = (manufacturer) => {
    service.getAvailability(manufacturer)
      .then(response => {
        const responseData = response.data.response;
        if (typeof responseData === 'object') {
          let newAvailabilityData = [];

          //make sure that data already fetch from server isn't lost
          if (availabilityData) {
            arrayKeys(availabilityData)
              .forEach(key => {
                newAvailabilityData[key] = availabilityData[key];
              });
          }

          //save data
          newAvailabilityData[manufacturer] = pareseAvailabilityData(responseData);
          setAvailabilityData(newAvailabilityData);
        } else {
          newError(`server failed to get data for ${manufacturer}`, setError);
        }
      })
      .catch(e => {
        if (e instanceof Error) {
          console.error(e.name, e.message);
          newError(`Failed to contact availability server for ${manufacturer}`, setError);
        }
      });
  };

  const gridRef = React.createRef();

  return (
    <div>
      <h1>Welcome!</h1>
      <Buttons setProduct={setProduct} />
      <ErrorComponent message={error} />
      <div>
        <h2>{title(product)}</h2>
        <SearchFormButtons gridRef={gridRef} data={data} />
        {!data || data[0].type !== product ? 'loading...' :
          <Table
            data={data}
            product={product}
            gridRef={gridRef}
          />
        }
      </div>
      <Footer />
    </div >
  );
};

export default App;