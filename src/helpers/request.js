'use strict';

const axios = require('axios');
const getCookie = require('./getCookie');

module.exports = async (endpoint, { method = 'get', body } = {}) => {
  const res = await axios[method](`${process.env.FORUM_URL}${endpoint}`, {
    headers: {
      Cookie: `R3ACTLB=${await getCookie()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    method,
  });
  const isSuccess = res && res.status === 200;
  return isSuccess ? res.data : null;
};
