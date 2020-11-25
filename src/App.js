import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JsxParser from 'react-jsx-parser';

import Table from './components/Table';
import { FixedSizeGrid as WindowList } from 'react-window';

const derpData = [
  {
    'code': 200,
    'response': [
      {
        'id': 'F8016F8E3897CBD129EC0FDE',
        'DATAPAYLOAD': '<AVAILABILITY><INSTOCKVALUE>INSTOCK</INSTOCKVALUE></AVAILABILITY>'
      },
      {
        'id': 'D9FE8BA212795CBA3914DD',
        'DATAPAYLOAD': '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>'
      },
    ],
  },
];

const dataData = [
  {
    'id': 'f8016f8e3897cbd129ec0fde',
    'type': 'shirts',
    'name': 'NYXBE BRIGHT METROPOLIS',
    'color': [
      'yellow'
    ],
    'price': 44,
    'manufacturer': 'derp',
  },
  {
    'id': 'a9262d3e27a19f6b9de',
    'type': 'shirts',
    'name': 'HUNKOX RAIN',
    'color': [
      'black'
    ],
    'price': 56,
    'manufacturer': 'abiplos'
  },
  {
    'id': '1358bf45194ae55f4a251b',
    'type': 'shirts',
    'name': 'REPBE LIGHT',
    'color': [
      'green'
    ],
    'price': 21,
    'manufacturer': 'nouke',
    'mask': 'hola'
  },
  {
    'id': '389008bf68017c54901',
    'type': 'shirts',
    'name': 'ONIOX EARTH',
    'color': [
      'white'
    ],
    'price': 57,
    'manufacturer': 'abiplos'
  }, {
    'id': '6d39a08b3bcae88a67',
    'type': 'jackets',
    'name': 'DERWEER TYRANNUS BANG',
    'color': [
      'purple'
    ],
    'price': 15,
    'manufacturer': 'abiplos'
  },
  {
    'id': '76ec839da3ef71ce0f936',
    'type': 'jackets',
    'name': 'WED STAR',
    'color': [
      'red'
    ],
    'price': 12,
    'manufacturer': 'nouke'
  },
  {
    'id': '8a683330a1d04fcb0e9a75',
    'type': 'jackets',
    'name': 'JILTYRP ROOM',
    'color': [
      'blue'
    ],
    'price': 43,
    'manufacturer': 'abiplos'
  },
  {
    'id': '15d252f9cf170cd68f7cb',
    'type': 'jackets',
    'name': 'ONILYR BANG',
    'color': [
      'green'
    ],
    'price': 59,
    'manufacturer': 'reps'
  },
  {
    'id': 'd9fe8ba212795cba3914dd',
    'type': 'jackets',
    'name': 'WEDHOP POWER',
    'color': [
      'grey'
    ],
    'price': 26,
    'manufacturer': 'derp'
  },
  {
    'id': 'faa32d49205765b4608d93',
    'type': 'jackets',
    'name': 'REP SWEET SLIP',
    'color': [
      'black'
    ],
    'price': 63,
    'manufacturer': 'abiplos'
  }
];

const baseURI = 'https://bad-api-assignment.reaktor.com';

const ReadAvailability = ({ children }) => children;

const App = () => {
  const [data, setData] = useState(null);
  const [reloadManufacturer, setReloadManufacturer] = useState(false);
  const [product, setProduct] = useState('shirts');
  const [allData, setAllData] = useState({});


  const getProduct = () => {
    //console.log('getProduct');
    return axios.get(`${baseURI}/products/${product}`);
  };

  const getAvailability = (availability) => {
    //console.log('getAvailability');
    return axios.get(`${baseURI}/availability/${availability}`
      //, { headers: { 'x-force-error-mode': 'all' } }
    );
  };

  useEffect(() => {
    console.log('eka');
    //see if product already fetched from server
    const newAllData = allData;
    if (!newAllData[product]) {
      console.log('get product from server');
      //get product information from server
      getProduct()
        .then(response => {
          const productData = response.data.map(item => (
            {
              ...item,
              id: item.id.toLowerCase()
            }
          ));
          //Convert product data to key-value array
          const keyValues = [];
          productData.forEach(item =>
            keyValues[item.id] = ({
              //saved using integers as keys for react-window
              0: item.name,
              1: item.manufacturer,
              2: item.price,
              3: item.color.join(' '),
              //initial value reload button to refetch availability information from server
              4: <button onClick={() => setReloadManufacturer(item.manufacturer)}>reload</button>,
              id: item.id,
              type: item.type
            })
          );
          //save product information
          newAllData[product] = keyValues;
          //Save all product availability information
          Object.values(keyValues)
            .map(item => item[1])
            .filter((value, index, self) => self.indexOf(value) === index)
            .forEach(manufacturer => {
              if (!newAllData[manufacturer]) {
                console.log(`get ${manufacturer} from server`);
                getAvailability(manufacturer)
                  .then((response) => {
                    const responseData = response.data.response;
                    if (typeof responseData === 'object') {
                      const availabilityData = responseData.map(item => (
                        {
                          id: item.id.toLowerCase(),
                          datapayload: <JsxParser components={{ AVAILABILITY: ReadAvailability, INSTOCKVALUE: ReadAvailability }} jsx={item.DATAPAYLOAD} />,
                        }
                      ));
                      newAllData[manufacturer] = availabilityData;
                    } else {
                      console.error('Server did not send data');
                    }
                  });
              }
            });
          setAllData(newAllData);
          setData(Object.values(newAllData[product]));
        });
    } else {
      setData(Object.values(allData[product]));
    }
  }, [product]);

  useEffect(() => {
    console.log('toka');
    if(allData[product]){
      console.log('on olemassa');
    }
  }, [product, allData] );


  /*
  if (allData) {
    console.log(Object.keys(allData));
    if (allData[product]) {
      console.log(Object.values(allData[product])[0]);
      console.log();
    }
  }

  if (data) {
    console.log('DATA');
  }
*/
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
          rowCount={data.length}
          rowHeight={50}
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
  return (
    <div style={{ ...style, borderBottomWidth: 1 }}>
      {item[columnIndex]}
    </div>
  );
};

export default App;