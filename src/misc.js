import React from 'react';

export const title = (text) => {
  const [first, ...rest] = text.split('');
  return first.toUpperCase().concat(rest.join(''));
};

let timeoutID;
export const newError = (message, error, setError) => {
  clearTimeout(timeoutID);
  setError(message);
  timeoutID = setTimeout(() => {
    setError(null);
  }, 1000 * 5);
};

export const Instockvalue = ({ children }) => {
  switch (children.props.children) {
    case 'INSTOCK':
      return 'Instock';
    case 'LESSTHAN10':
      return ' Less than 10';
    case 'OUTOFSTOCK':
      return 'Out of stock';
    default:
      return children;
  }
};

export const Availability = ({ children }) => children;

export const ErrorComponent = ({ message }) => (
  <div style={{
    color: 'red',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 'large'
  }}> {message}
  </div>
);