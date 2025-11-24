import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Root path for custom domain
  server: {
    proxy: {
      '/api': {
        target: 'https://api.formitable.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
