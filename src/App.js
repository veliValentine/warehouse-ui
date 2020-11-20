import React from 'react';
import Table from './components/Table';

let derp = [
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

let data = [
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
  //store data as key-value pair. ID is the key.
  let o = [];
  for (let i = 0; i < data.length; i++) {
    const da = data[i];
    o[da.id.toLowerCase()] = { ...da, id: da.id.toLowerCase() };
  }
  data = o;

  //Add availablitity information to data object
  derp = derp[0].response.map(item => ({ id: item.id.toLowerCase(), availability: item.DATAPAYLOAD }));
  derp.forEach(item => {
    const id = item.id.toLowerCase();
    data[id] = { ...data[id], availability: item.availability };
  });

  return (
    <div>
      <h1>Welcome!</h1>
      <Table
        data={Object.values(data)}
        headers={Object.keys(Object.values(data)[0])}
      />
    </div>
  );
};
export default App;
