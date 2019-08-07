// @flow strict
const { request: httpRequest } = require('http');
const { request: httpsRequest } = require('http');
/*::
import type { Contract } from './contract';
*/
/*::
export type MockClient = {
  start: () => Promise<void>,
};
*/

const createMockClient = request => (
  contract/*: Contract*/,
  origin/*: string*/
)/*: MockClient*/ => {
  const start = () => new Promise((resolve, reject) => {
    const url = new URL(origin, contract.request.path);
    const headers = {};
    for (const [headerName, headerValue] of contract.request.headers) {
      headers[headerName] = headerValue;
    }
    const requestOptions = {
      method: contract.request.method,
      headers, 
    };
    const clientRequest = request(url.href, requestOptions, response => {
      response.on('error', (error) => reject(error))
      response.on('end', () => resolve());
    });
    if (contract.request.body) {
      clientRequest.write(contract.request.body);
    }
    clientRequest.end();
  });

  return {
    start,
  };
};

const createMockHttpClient = createMockClient(httpRequest);
const createMockHttpsClient = createMockClient(httpsRequest);

module.exports = {
  createMockHttpClient,
  createMockHttpsClient,
};
