import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
  build: {
    manifest: true,
    outDir: 'dist/client',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
