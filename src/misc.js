import React from 'react';

export const title = (text) => {
  const [first, ...rest] = text.split('');
  return first.toUpperCase().concat(rest.join(''));
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