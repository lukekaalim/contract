// @flow strict
const { expect, assert, expectAll } = require('@lukekaalim/test');
const { createContractServer, withContractServer } = require('./server');
const { get } = require('http');

const contract = {
  name: 'example-contract',
  request: {
    path: '/path',
    body: '',
    headers: [],
    method: 'GET',
  },
  response: {
    status: 200,
    headers: [],
    body: 'Successful Response',
  }
};

const shouldReturnNotFound = expect(async () => {
  const server = createContractServer(contract);
  const { port } = await server.open();
  const incomingMessage = await new Promise(res => get(`http://localhost:${port}/not-the-correct-path`, {}, res));
  const assertion = assert('Expect the wrong path to return a 404 response', incomingMessage.statusCode === 404);
  server.close();
  return assertion;
});

const serverExpectation = expectAll('Contract Mock Server', [
  shouldReturnNotFound,
]);

module.exports = {
  serverExpectation,
};
