import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/inworld': {
        target: 'https://api.inworld.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/inworld/, ''),
        secure: true,
        timeout: 60000, // 60秒超时，处理大文件上传
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // 设置更长的超时时间
            proxyReq.setTimeout(60000);
          });
        },
      },
    },
  },
})

