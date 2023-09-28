import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import express from './express-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), express('src/server')],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
