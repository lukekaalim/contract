// @flow
import { createServer, request } from 'http';
/*::
type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'UPDATE'
*/

/*::
export type Request = {
  path: string,
  headers: Array<[string, string]>,
  method: HTTPMethod,
  body: string | null,
};
*/

export const createRequest = (
  path/*: string*/,
  method/*: HTTPMethod*/ = 'GET',
  body/*: string | null*/ = null,
  headers/*: Array<[string, string]>*/ = [],
)/*: Request */ => ({
  path,
  method,
  headers,
  body
});

/*::
export type Response = {
  status: number,
  headers: Array<[string, string]>,
  body: string,
};
*/
export const createResponse = (
  body/*: string*/,
  status/*: number*/ = 200,
  headers/*: Array<[string, string]>*/ = [],
)/*: Response */ => ({
  status,
  headers,
  body
});

/*::
export type Contract = {
  name: string,
  request: Request,
  response: Response,
};
*/

export const createContract = (
  name/*: string*/,
  request/*:Request*/,
  response/*: Response*/
)/*: Contract*/ => ({
  name,
  request,
  response,
});

export const createMockClient = (
  contract/*: Contract*/
) => (
  origin/*: string*/
)/*: Promise<void>*/ => new Promise(resolve => {
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
    response.on('end', () => resolve());
  });
  if (contract.request.body) {
    clientRequest.write(contract.request.body);
  }
  clientRequest.end();
});

export const createMockServer = (
  contract/*: Contract*/
)/*: Promise<{ address: string, port: string, close: () => Promise<void> }>*/ => new Promise(resolve => {
  const listener = (inc, res) => {
    const headers = [];
    for (let i = 0; i < inc.rawHeaders.length / 2; i ++) {
      headers[i] = [inc.rawHeaders[i * 2], inc.rawHeaders[(i * 2) + 1]];
    }
    const headersMatch = contract.request.headers.every(([contractHeaderName, contractHeaderValue]) => (
      headers.find(
        ([headerName, headerValue]) => headerName === contractHeaderName && contractHeaderValue === headerValue
      )
    ));
    const matchesContract = contract.request.path === inc.url && headersMatch && inc.method === contract.request.method;
    if (matchesContract) {
      for (const [headerName, headerValue] of contract.response.headers) {
        res.setHeader(headerName, headerValue);
      }
      res.statusCode = contract.response.status;
      res.write(contract.response.body);
      res.end();
    }
    res.end();
  };
  const server = createServer(listener);
  const serverAddressObject = server.address();
  server.listen(0, () => resolve({
    address: serverAddressObject.address,
    port: serverAddressObject.port,
    close: () => new Promise(resolve => server.close(() => resolve()))
  }));
});
