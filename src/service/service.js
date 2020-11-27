import axios from 'axios';

const baseURI = 'https://bad-api-assignment.reaktor.com';


const getProduct = (product) => {
  return axios.get(`${baseURI}/products/${product}`);
};

const getAvailability = (availability, error) => {
  return axios.get(`${baseURI}/availability/${availability}`
    , { headers: { 'x-force-error-mode': error ? 'all' : '' } }
  );
};

export default {
  getProduct,
  getAvailability,
};
