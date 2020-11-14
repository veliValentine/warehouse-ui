import React from 'react';

const Header = ({ headers }) => {
  return (
    <tr>
      {headers.map(h => <th key={h}>{h.toUpperCase()}</th>)}
    </tr>
  );
};

const Body = ({ data, headers }) => {
  return (
    <tr>
      {headers.map(header => <td key={header}>{data[header]}</td>)}
    </tr>
  );
};

const Table = ({ data, headers }) => {
  headers = headers ? headers : ['type', 'name', 'color', 'price', 'manufacturer'];
  return (
    <table>
      <thead>
        <Header headers={headers} />
      </thead>
      <tbody>
        {data.map(d => <Body key={d.id} data={d} headers={headers} />)}
      </tbody>
    </table>
  );
};

export default Table;