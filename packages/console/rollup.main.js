const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.main.ts',
  output: {
    file: 'dist/index.main.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
    })
  ],
};