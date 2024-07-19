import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
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