import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import socket from './socket-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), socket()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
