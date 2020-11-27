import React from 'react';
import JsxParser from 'react-jsx-parser';
import { Availability, Instockvalue } from './components/Availability';

// convert string so that first index is in upperCase
export const title = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  const [first, ...rest] = text.split('');
  return first.toUpperCase().concat(rest.join(''));
};

let timeoutID;
export const newError = (message, setError) => {
  console.error(message);
  clearTimeout(timeoutID);
  setError(message);
  timeoutID = setTimeout(() => {
    setError(null);
  }, 1000 * 10);
};

export const uniqueManufacturer = (arr) => (
  arr.map(product => product.manufacturer)
    .filter((v, i, s) => s.indexOf(v) === i)
);

export const arrayKeys = (arr) => Object.keys(arr);

export const pareseAvailabilityData = (arr) => (
  arr.map(obj => ({
    id: obj.id.toLowerCase(),
    //convert availability data to React component
    availability: <JsxParser components={{ AVAILABILITY: Availability, INSTOCKVALUE: Instockvalue }} jsx={obj.DATAPAYLOAD.trim()} />
  }))
);