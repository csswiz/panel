import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Fix SPA 404 on deep-link reload (mobile & desktop)
  server: {
    historyApiFallback: true,   // dev server
  },
  preview: {
    historyApiFallback: true,   // `vite preview` server
  },
})
