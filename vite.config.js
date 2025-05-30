import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:80',  // 目标服务器地址(添加端口号)
        changeOrigin: true,         // 启用跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
      }
    }
  }
})
