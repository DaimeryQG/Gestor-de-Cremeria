<template>
  <div class="app-container">
    <!-- Botón para abrir menú -->
    <button 
      class="menu-button animate-bounce" 
      v-if="route.path !== '/login' && !isMenuOpen" 
      @click="toggleMenu">
      ☰
    </button>

    <!-- Sidebar -->
    <Sidebar v-if="route.path !== '/login'" :isMenuOpen="isMenuOpen" @toggleMenu="toggleMenu" />

    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'with-sidebar': isMenuOpen }">
      <Navbar v-if="route.path !== '/login'" />
      <router-view />
    </div>

    <!-- Footer -->
    <Footer v-if="route.path !== '/login'" />

    <!-- Notificación de Bienvenida con color -->
    <transition name="slide-right">
      <div v-if="showWelcome" class="toast-container">
        <div class="toast show custom-toast" role="alert">
          <div class="toast-header toast-success">
            <strong class="me-auto">🎉 Bienvenido</strong>
            <button type="button" class="btn-close" @click="closeWelcome"></button>
          </div>
          <div class="toast-body">
            ¡Hola, {{ username }}! Nos alegra verte de nuevo. 🚀
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/views/Navbar.vue';
import Sidebar from '@/components/views/Sidebar.vue';
import Footer from '@/components/views/Footer.vue';

const isMenuOpen = ref(false);
const showWelcome = ref(false);
const username = ref('');
const route = useRoute();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeWelcome = () => {
  showWelcome.value = false;
};

// ✅ Detectar si el usuario inició sesión
const checkLogin = () => {
  const user = JSON.parse(sessionStorage.getItem('usuario'));
  if (user?.username) {
    username.value = user.username;
    showWelcome.value = true;
    setTimeout(() => {
      showWelcome.value = false;
    }, 3000);
  }
};

// ✅ Llamar a `checkLogin` cada vez que el usuario inicia sesión
watch(route, (newRoute, oldRoute) => {
  if (newRoute.path === '/' && oldRoute?.path === '/login') {
    checkLogin();
  }
});

// ✅ Asegurar que la notificación aparezca cada vez que se inicie sesión
onMounted(() => {
  if (route.path === '/') {
    checkLogin();
  }
});
</script>

<style scoped>
/* Estilos generales */
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Evita scroll horizontal */
  width: 100%;
  height: 100%;
  background-color: #F5F5DC;
}

/* ✅ Contenedor principal */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* ✅ Navbar */
.navbar {
  width: 100%;
  background: #1E3A5F;
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  font-size: 1.5rem;
}

.navbar-title {
  font-size: 1.5rem;
  margin: 0 auto;
  text-align: center;
}

/* ✅ Botón de menú */
.menu-button {
  position: fixed;
  top: 15px;
  left: 15px;
  background-color: #FFB400;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1100;
  font-size: 1.5rem;
}

.menu-button:hover {
  background-color: #E0A000;
}

/* ✅ Contenido principal */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 4rem 2rem 2rem 2rem; /* Deja espacio para navbar */
  background-color: #F5F5DC;
  margin-top: 60px; /* Altura del navbar */
  transition: margin-left 0.3s ease-in-out;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

/* ✅ Ajustes de Sidebar */
.with-sidebar {
  margin-left: 250px;
}

@media (max-width: 768px) {
  .with-sidebar {
    margin-left: 200px;
  }
}

/* ✅ Estilos de Notificación */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  overflow: hidden;
}

.custom-toast {
  background-color: #28a745; /* Verde éxito */
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.toast-header {
  background-color: #218838; /* Verde más oscuro */
  color: white;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 8px 8px 0 0;
}

/* ✅ Animación de entrada desde la derecha */
@keyframes slideRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.slide-right-enter-active {
  animation: slideRight 0.5s ease-out;
}

.slide-right-leave-active {
  animation: fadeOut 0.5s ease-in;
}
</style>
