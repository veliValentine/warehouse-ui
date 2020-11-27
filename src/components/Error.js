import React from 'react';

const ErrorComponent = ({ message }) => (
  <div style={{
    color: 'red',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 'large'
  }}>
    {message}
  </div>
);

export default ErrorComponent;