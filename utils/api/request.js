import axios     from 'axios'
import constants from './httpConstant'

const client = axios.create({
  baseURL: constants.url,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    withCredentials: true,
  }

});

client.interceptors.request.use(function (config) {
    console.log(config,"config");
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  client.interceptors.response.use(function (response) {

    console.log(response,"response");
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });


const request = function(options) {

    
    
  const onSuccess = function(response) {
    console.debug('Request Successful!', response);
    return response.data;
  }

  const onError = function(error) {
    console.error('Request Failed:', error.config);

    if (error.response) {
    
      console.error('Status:',  error.response.status);
      console.error('Data:',    error.response.data);
      console.error('Headers:', error.response.headers);

    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  }

  return client(options)
            .then(onSuccess)
            .catch(onError);
}

export default request;