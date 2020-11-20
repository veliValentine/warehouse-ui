import React from 'react';
import JsxParser from 'react-jsx-parser';

const Header = ({ headers }) => (
  <tr>
    {headers.map(h => <th key={h}>{h.toUpperCase()}</th>)}
  </tr>
);

const Availability = ({ children }) => children;

const Instockvalue = ({ children }) => children;

const Body = ({ data, headers }) => {
  if (data.availability && (typeof data.availability === 'string' || data.availability instanceof String)) {
    data.availability = <JsxParser components={{ AVAILABILITY: Availability, INSTOCKVALUE: Instockvalue }} jsx={data.availability} />;
  }
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