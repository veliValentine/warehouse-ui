import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const App = () => {
  const [data, setData] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [product, setProduct] = useState('shirts');

  const getProduct = () => {
    return axios.get(`https://bad-api-assignment.reaktor.com/products/${product}`);
  };

  const getAvailability = (availability) => {
    return axios.get(`https://bad-api-assignment.reaktor.com/availability/${availability}`
      //, { headers: { 'x-force-error-mode': 'all' } }
    );
  };

  useEffect(() => {
    getProduct()
      .then(response => {
        const allData = response.data.map(item => ({ ...item, id: item.id.toLowerCase() }));
        const keyValues = [];
        allData.forEach(item => keyValues[item.id] = ({
          0: item.name,
          1: item.manufacturer,
          2: item.price,
          3: item.color.join(' '),
          4: 'loading',
          id: item.id,
          type: item.type
        }));
        setData(keyValues);
        setAvailability(keyValues);
      });
  }, []);

  if (data) {
    null;
  }
  return (
    <div>
      <h1>Welcome!</h1>
      <h3>{product}</h3>
      {!data ? null :
        <WindowList
          height={500}
          width={600}
          columnCount={5}
          columnWidth={100}
          rowCount={Object.values(data).length}
          rowHeight={50}
          itemData={Object.values(data)}
          style={{ borderBottomWidth: 1 }}
        >
          {Row}
        </WindowList>
      }
    </div >
  );
};

const Row = (props) => {
  console.log({ props });
  const { style, columnIndex, rowIndex, data } = props;
  const item = data[rowIndex];
  return (
    <div style={{ ...style, borderBottomWidth: 1 }}>
      {item[columnIndex]}
    </div>
  );
};

export default App;
