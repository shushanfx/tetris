const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
      name: 'TetrisCore'
    }
  ],
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
    })
  ],
};