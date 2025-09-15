import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'pathe'

export default defineConfig({
  plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
