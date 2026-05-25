import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // 前端统一走 /api/openai，避免浏览器 CORS 预检失败
      '/api/openai': {
        target: 'https://api.jiekou.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/openai/, '/openai')
      }
    }
  }
})
