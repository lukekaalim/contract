// @flow strict
const { createServer } = require('http');
/*::
import type { Contract } from './contract';
*/

/*::
type MockServer = {
  open: () => Promise<{ address: string, port: number }>,
  close: () => Promise<void>,
};
*/

const createMockServer = (
  contract/*: Contract*/,
  port/*: number*/ = 0,
)/*: MockServer*/ => {
  const listener = (inc, res) => {
    const headersMatch = contract.request.headers.every(([name, value]) => inc.headers[name] === value);
    const urlsMatch = contract.request.path === inc.url;
    const methodsMatch = inc.method === contract.request.method;
    if (headersMatch && urlsMatch && methodsMatch) {
      for (const [headerName, headerValue] of contract.response.headers) {
        res.setHeader(headerName, headerValue);
      }
      res.statusCode = contract.response.status;
      res.write(contract.response.body);
    } else {
      res.statusCode = 404;
      res.write(JSON.stringify({ type: 'contract-error', message: 'Failed to satisfy the contract' }));
    }
    res.end();
  };
  const server = createServer(listener);

  const open = () => new Promise(resolve => {
    server.listen(0, () => resolve(server.address()));
  });

  const close = () => new Promise(resolve =>
    server.close(() => resolve())
  );

  return {
    open,
    close,
  };
};

module.exports = {
  createMockServer,
}