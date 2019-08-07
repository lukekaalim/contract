// @flow strict
const serverExports = require('./server');
const contractExports = require('./contract');

module.exports = {
  ...serverExports,
  ...contractExports,
};
