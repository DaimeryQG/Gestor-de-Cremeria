import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 🔹 Asegurar que la ruta es correcta
    }
  },
  server: {
    host: true, // Permitir acceso en la red
    port: 5173, // Especificar puerto
    strictPort: true, // Evitar que cambie el puerto
    open: true // Abrir automáticamente en el navegador
  }
});
