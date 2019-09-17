// @flow strict
const { createContract, createContractServer, createRequest, createResponse } = require('./');
const { expectTrue, expectAll, expect, emojiReporter } = require('@lukekaalim/test');

const { expectContractToValidate } = require('./src/contract.test');


const test = async () => {
  const expectation = expectAll('@lukekalaim/contract', [
    expectContractToValidate,
  ]);
  const assertion = await expectation.test();
  console.log(emojiReporter(assertion));
  process.exitCode = assertion.validatesExpectation ? 0 : 1;
};

test();