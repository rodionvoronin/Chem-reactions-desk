import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Относительные пути к ассетам — сборка работает и на локальном сервере,
  // и на GitHub Pages в подпапке вида /имя-репозитория/ (имя знать не нужно)
  base: './',
})
