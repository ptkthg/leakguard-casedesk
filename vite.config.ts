import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

const isTauri = process.env.TAURI_ENV_DEBUG !== undefined

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  // Required for Electron: assets must use relative paths (file:// protocol)
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Tauri: prevent Vite from obscuring Rust errors
  clearScreen: false,
  server: {
    // Tauri expects a fixed port — fail if not available
    port: 5173,
    strictPort: true,
    // Make HMR work in Tauri desktop window
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  // Build settings for Tauri
  build: {
    // Tauri uses Chromium on Windows & WebKit on macOS/Linux
    target: isTauri ? ['chrome105', 'safari15'] : ['es2020'],
    sourcemap: isTauri && process.env.TAURI_ENV_DEBUG === 'true',
  },
})
