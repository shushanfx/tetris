import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@tetris/core': path.resolve(process.cwd(), '../packages/core/src'),
    }
  },
  plugins: [vue()],
})
