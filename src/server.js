// @flow strict
const { createServer } = require('http');
const { succeed, fail } = require('@lukekaalim/result');
/*::
import type { Result } from '@lukekaalim/result';
import type { Contract } from './contract';
*/

/*::
type MockServer = {
  open: () => Promise<{ address: string, port: number }>,
  close: () => Promise<void>,
  onContractVerify: (<T>(contractResult: Result<void, void>) => void) => void,
  getContractVerified: () => boolean,
};
*/

const createContractServer = (
  contract/*: Contract*/,
  port/*: number*/ = 0,
)/*: MockServer*/ => {
  const resultListeners = [];
  let verified = false;

  const listener = (inc, res) => {
    const urlsMatch = contract.request.path === inc.url;
    const methodsMatch = inc.method === contract.request.method;
    if (urlsMatch && methodsMatch) {
      for (const [headerName, headerValue] of contract.response.headers) {
        res.setHeader(headerName, headerValue);
      }
      res.statusCode = contract.response.status;
      res.write(contract.response.body);
      resultListeners.map(listener => listener(succeed()));
    } else {
      res.statusCode = 500;
      res.write(JSON.stringify({ type: 'contract-error', message: 'Failed to satisfy the contract' }));
      resultListeners.map(listener => listener(fail()));
    }
    res.end();
  };
  const server = createServer(listener);

  const open = async () => {
    await new Promise(resolve => server.listen(0, () => resolve()));
    return server.address();
  };
  const close = async () => {
    resultListeners.length = 0;
    await new Promise(resolve => server.close(() => resolve()));
  };
  const onContractVerify = (resultListener) => {
    resultListeners.push(resultListener);
  };
  onContractVerify((result) => { verified = result.type === 'success' });
  const getContractVerified = () => {
    return verified;
  };

  return {
    open,
    close,
    onContractVerify,
    getContractVerified,
  };
};

const withContractServer = async /*:: <T>*/(
  contract/*: Contract*/,
  serverHandler/*: (serverBaseUrl: string) => (T | Promise<T>)*/
)/*: Promise<Result<T, void>>*/ => {
  const server = createContractServer(contract);
  try {
    const { address, port } = await server.open();
    const serverHandlerReturn = await serverHandler(`http://localhost:${port}`);
    if (!server.getContractVerified())
      return fail();
    return succeed(serverHandlerReturn);
  } finally {
    await server.close();
  }
};

module.exports = {
  createContractServer,
  withContractServer,
}