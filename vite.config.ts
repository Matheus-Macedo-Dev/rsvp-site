import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  base: '/rsvp-site/', // Update this to match your repository name
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Enabled by default
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vuetify'],
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
