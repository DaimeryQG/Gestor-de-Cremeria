import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import ViteJavascriptObfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    vue()
    /*
    ViteJavascriptObfuscator({
      // Opciones para la ofuscación
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
    })
      */
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: true,
  open: false, 
  cors: true,
  allowedHosts: ['b634-38-65-128-98.ngrok-free.app'],
  proxy: {
      '/proveedores': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/productos': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/registros': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/feedback': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
  },
  '/ventas': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
  },
  '/reportes': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
  },
      // Si tienes más endpoints backend, agrégalos aquí
    },
  },
  build: {
    minify: true,
    sourcemap: false,
  }
});
