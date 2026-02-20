import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/scorecards': { target: 'http://localhost:8080', changeOrigin: true },
      '/calculate': { target: 'http://localhost:8080', changeOrigin: true },
      '/leaderboard': { target: 'http://localhost:8080', changeOrigin: true },
      '/export': { target: 'http://localhost:8080', changeOrigin: true },
    }
  }
})