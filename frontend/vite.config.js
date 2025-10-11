// ============================================================
// VITE CONFIG - Configuración de Vite + Proxy para Backend
// ============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ============================================================
  // CONFIGURACIÓN DEL SERVIDOR DE DESARROLLO
  // ============================================================
  server: {
    port: 5173,
    host: true,
    
    // Proxy para conectar con el backend Flask
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Reescribir la ruta si es necesario
        // rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },

  // ============================================================
  // ALIAS DE RUTAS
  // ============================================================
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },

  // ============================================================
  // OPTIMIZACIÓN DE BUILD
  // ============================================================
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y ReactDOM en su propio chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar recharts (librería grande) en su propio chunk
          'charts': ['recharts'],
        }
      }
    },
    // Optimizar recursos
    chunkSizeWarningLimit: 1000,
  },

  // ============================================================
  // VARIABLES DE ENTORNO
  // ============================================================
  // Las variables que empiezan con VITE_ estarán disponibles en el cliente
  envPrefix: 'VITE_',

  // ============================================================
  // CONFIGURACIÓN DE PREVIEW (para producción)
  // ============================================================
  preview: {
    port: 4173,
    host: true,
  }
})

