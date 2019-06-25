// @flow
import { createContract, createMockServer, createRequest, createResponse } from '../';
import { createTest, colorfulReporter, equal } from 'lk-test';

const mockServerTest = createTest('createMockServer()', async () => {
  const contract = createContract('testContract', createRequest('/users'), createResponse(JSON.stringify([])));
  const mockServer = await createMockServer(contract);

  const assertions = [
    equal(typeof mockServer.address, 'string'),
    equal(typeof mockServer.port, 'number')
  ];

  mockServer.close();

  return assertions;
});

const runTests = async () => {
  console.log(colorfulReporter([await mockServerTest.run()]))
};

runTests();