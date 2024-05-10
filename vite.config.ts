import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/index.scss";`,
      },
    },
  },
  // 配置别名
  resolve: {
    alias: {
      '@': resolve('src'),
      static: resolve('public/static'),
    },
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    port: 8081,
    proxy: {
      '/api': {
        // target:'http://localhost:3000',
        target: 'http://120.46.50.38:8000',
        changeOrigin: true,
        // rewrite: (path) => {
        //   return path.replace(/^\/api/, '')
        // },
      },
    },
  },
})
