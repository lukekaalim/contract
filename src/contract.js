// @flow strict
const { nameModel, modelTuple, modelArray, modelObject, stringModel, numberModel, modelTagUnion } = require('@lukekaalim/model');
/*::
import type { Model } from '@lukekaalim/model';
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'UPDATE'
*/

const httpMethodModel/*: Model<HTTPMethod>*/ = nameModel(
  'Contract/HTTPMethod',
  modelTagUnion(['GET', 'POST', 'DELETE', 'PUT', 'UPDATE']),
);

/*::
export type Request = {
  path: string,
  headers: Array<[string, string]>,
  method: HTTPMethod,
  body: string,
};
*/
const requestModel/*: Model<Request>*/ = nameModel('Contract/Request', modelObject({
  path: stringModel,
  headers: modelArray(modelTuple([stringModel, stringModel])),
  method: httpMethodModel,
  body: stringModel,
}));

const createRequest = (
  path/*: string*/,
  method/*: HTTPMethod*/ = 'GET',
  body/*: string*/ = '',
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
const responseModel/*: Model<Response>*/ = nameModel('Contract/Response', modelObject({
  status: numberModel,
  headers: modelArray(modelTuple([stringModel, stringModel])),
  body: stringModel,
}));
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
const contractModel/*: Model<Contract>*/ = nameModel('Contract', modelObject({
  name: stringModel,
  request: requestModel,
  response: responseModel,
}));

const createContract = (
  name/*: string*/,
  request/*: Request*/,
  response/*: Response*/
)/*: Contract*/ => ({
  name, request, response
});

module.exports = {
  createContract,
  createRequest,
  createResponse,
  contractModel,
  requestModel,
  responseModel,
};
