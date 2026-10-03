import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendUrl = 'https://divac-two.vercel.app';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  optimizeDeps: {
    entries: ['index.html'],
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true
      }
    }
  }
});