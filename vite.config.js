// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind v3 funciona via PostCSS (postcss.config.js), não precisa de @tailwindcss/vite
export default defineConfig({
  plugins: [react()],
})
