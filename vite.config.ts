import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
// 地址
import path from 'path';


// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ command,mode}) =>{
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 如果当前环境是开发环境，则 mode 为 development
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  // @ts-ignore
  let baseURL = '';
  if(mode === 'staging') { // 预备模式
    baseURL = env.NODE_ENV === 'development' ? env.VITE_DEV_SERVER : env.VITE_SERVER
  } else { // development或production模式
    baseURL = ''
  }

  return  {
    plugins: [vue()],
    resolve: {
      alias: {
        // '@' 将指向 'src' 目录
        '@': path.resolve(__dirname, 'src'),//安装 pnpm install @types/node -D
        // 'components' 将指向 'src/components' 目录
        components: path.resolve(__dirname, 'src/components'),
      },
    },
    server: {
      open:true,   //默认启动项目打开页面
      port:5173,   //端口号
      proxy: {
        "/api": {
          // 匹配请求路径，
          target: 'http://43.134.53.50:3563',//正式域名
          changeOrigin: true,
          // secure: true, // 是否https接口
          ws: true, // 是否代理websockets
          // rewrite: (path) => path,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://localhost:8092/', // 目标服务器地址
    //       changeOrigin: true, // 是否改变源地址
    //       rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
    //     }
    //   }
    // }
    // 打包限制
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
  }
})


