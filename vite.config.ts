import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Для gh-pages застосунок лежить у підкаталозі /vue-lottery-app/
    base: env.VITE_BASE_PATH || (mode === 'production' ? '/vue-lottery-app/' : '/'),
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  }
})
