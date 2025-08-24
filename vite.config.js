import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/info-vault/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          components: [
            './src/components/TabBar.vue',
            './src/components/SearchBar.vue',
            './src/components/InfoCard.vue',
            './src/components/EmptyState.vue',
            './src/components/AddInfoModal.vue',
            './src/components/ViewInfoModal.vue',
            './src/components/Toast.vue',
            './src/components/OfflineIndicator.vue'
          ]
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
})
