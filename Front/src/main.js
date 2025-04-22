import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar Bootstrap y estilos globales
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Crear y montar la app
createApp(App).use(router).mount('#app');

sessionStorage.removeItem('usuario');

