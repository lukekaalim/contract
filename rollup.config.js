import flowEntry from 'rollup-plugin-flow-entry'

const rollupConfig = {
  input: 'src/lk-contract.js',
  external: [ 'http' ],
  output: [
    { format: 'esm', file: 'dist/lk-contract.esm.js' },
    { format: 'cjs', file: 'dist/lk-contract.cjs.js' },
  ],
  plugins: [flowEntry()],
};

export default rollupConfig;
