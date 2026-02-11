import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Se der erro aqui, rode: npm install -D @types/node

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})