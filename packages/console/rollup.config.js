const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'node',
      }
    })
  ],
};