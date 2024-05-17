const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.main.ts',
  output: {
    file: 'dist/index.main.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
    })
  ],
};