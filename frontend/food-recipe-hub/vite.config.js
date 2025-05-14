import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ✅ This fixes broken asset paths on S3
  plugins: [react()],
})
