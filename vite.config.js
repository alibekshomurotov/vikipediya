import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vikipediya/'
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://zonal-dorisa-louisgituhi-a992d867.koyeb.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to:', req.url);
          });
        }
      }
    }
  }
})
