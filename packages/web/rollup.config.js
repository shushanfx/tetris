const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
      name: 'TetrisWeb',
      globals: {
        '@shushanfx/tetris-core': 'TetrisCore'
      }
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
    }
  ],
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