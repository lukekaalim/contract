// @flow strict
/*::
export type HTTPMethod =
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

const createRequest = (
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
const createResponse = (
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

const createContract = (
  name/*: string*/,
  request/*:Request*/,
  response/*: Response*/
)/*: Contract*/ => ({
  name,
  request,
  response,
});

module.exports = {
  createContract,
  createRequest,
  createResponse,
}