// @flow strict
const { request } = require('http');
const { succeed, fail } = require('@lukekaalim/result');
/*::
import type { Contract } from './contract';
import type { Result } from '@lukekaalim/result';
*/
/*::
export type MockClient = {
  execute: () => Promise<Result<void, Error>>,
};
*/

const readStream = stream => new Promise((resolve, reject) => {
  const chunks = [];
  stream.setEncoding('utf-8');
  stream.on('data', data => chunks.push(data));
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve(chunks.join('')));
});

const createContractClient = (
  contract/*: Contract*/,
  baseUrl/*: string*/
)/*: MockClient*/ => {
  const execute = () => new Promise((resolve, reject) => {
    const url = new URL(contract.request.path, baseUrl);
    const headers = {};
    for (const [headerName, headerValue] of contract.request.headers) {
      headers[headerName] = headerValue;
    }
    const requestOptions = {
      method: contract.request.method,
      headers, 
    };
    const onResponse = async (response) => {
      const body = await readStream(response);
      const statusCodeMatches = response.statusCode === contract.response.status;
      if (statusCodeMatches) {
        resolve(succeed());
      } else {
        resolve(fail(new Error(`Contract Status Code "${contract.response.status}" !== "${response.statusCode}"`)));
      }
    };
    const clientRequest = request(url.href, requestOptions, r => void onResponse(r));
    if (contract.request.body) {
      clientRequest.write(contract.request.body);
    }
    clientRequest.end();
  });

  return {
    execute,
  };
};

const withContractClient = async /*:: <T>*/(
  contract/*: Contract*/,
  baseUrl/*: string*/,
  clientHandler/*: (client: MockClient) => (T | Promise<T>)*/,
)/*: Promise<Result<T, Error>>*/ => {
  try {
    const client = createContractClient(contract, baseUrl);
    return succeed(await clientHandler(client));
  } catch (error) {
    return fail(error);
  }
};

module.exports = {
  createContractClient,
  withContractClient,
};
