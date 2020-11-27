import request from './request'
function getString(value,context) {
  return request({
    url:    value,
    method: 'GET'
  });
}

function getArray(valueData,context='') {
    return request({
      url:    valueData,
      method: 'GET'
    });
  }

function create(dataValue,context='') {
  return request({
    url:    context,
    method: 'POST',
    data:   {
        dataValue
    }
  });
}

function post(dataValue,context='') {
    return request({
      url:    context,
      method: 'POST',
      data:   {
          dataValue
      }
    });
  }

function put(dataValue,context='') {
    return request({
      url:    context,
      method: 'put',
      data:   {
          dataValue
      }
    });
  }

function patch(dataValue,context='') {
    return request({
      url:    context,
      method: 'patch',
      data:   {
          dataValue
      }
    });
  }

  function deleteApi(dataValue,context='') {
    return request({
      url:    context,
      method: 'delete',
      data:   {
          dataValue
      }
    });
  }

const Service = {
  create,getString,getArray,deleteApi,patch,put,post
}

export default Service;