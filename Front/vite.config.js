import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteJavascriptObfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    vue(),
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
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true
  },
  build: {
    minify: true,
    sourcemap: false,
  }
});
