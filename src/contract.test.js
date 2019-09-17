// @flow strict
const { expect, assert } = require('@lukekaalim/test');
const { createContract } = require('./contract');
const { withContractServer } = require('./server');
const { withContractClient } = require('./client');

const expectContractToValidate = expect(async () => {
  const contract = createContract('example_contract', {
    path: '/',
    method: 'GET',
    headers: [],
    body: '',
  }, {
    status: 200,
    headers: [],
    body: '',
  });

  const result = await withContractServer(contract, async baseUrl => {
    return await withContractClient(contract, baseUrl, async client => {
      await client.execute();
    })
  });

  return assert('Contract should validate with client and server',
    result.type === 'success' &&
    (await result.success).type === 'success'
  );
});

module.exports = {
  expectContractToValidate,
}