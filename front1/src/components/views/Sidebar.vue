<template>
  <div :class="['sidebar', { 'show': isMenuOpen }]">
    <div class="sidebar-header">
      <h5 class="sidebar-title">📌 Menú Principal</h5>
      <button v-if="isMenuOpen" class="btn btn-close" @click="emitToggleMenu" aria-label="Cerrar"></button>
    </div>

    <ul class="sidebar-menu">
      <li><router-link to="/dashboard" class="menu-link" @click="emitToggleMenu"><i class="bi bi-grid"></i> Inicio</router-link></li>
      <li><router-link to="/ventas" class="menu-link" @click="emitToggleMenu"><i class="bi bi-cart"></i> Gestión de Ventas</router-link></li>
      <li><router-link to="/productos" class="menu-link" @click="emitToggleMenu"><i class="bi bi-box"></i> Inventario</router-link></li>
      <li><router-link to="/proveedores" class="menu-link" @click="emitToggleMenu"><i class="bi bi-truck"></i> Proveedores</router-link></li>
      <li><router-link to="/estadisticas" class="menu-link" @click="emitToggleMenu"><i class="bi bi-bar-chart"></i> Análisis de Datos</router-link></li>
      <li><router-link to="/usuarios" class="menu-link" @click="emitToggleMenu"><i class="bi bi-people"></i> Administración de Usuarios</router-link></li>
      <li><router-link to="/clientes" class="menu-link" @click="emitToggleMenu"><i class="bi bi-person-badge"></i> Gestión de Clientes</router-link></li>
      <li><router-link to="/reportes" class="menu-link" @click="emitToggleMenu"><i class="bi bi-file-earmark-bar-graph"></i> Reportes</router-link></li>
      <li><router-link to="/historial" class="menu-link" @click="emitToggleMenu"><i class="bi bi-clock-history"></i> Historial de Cambios</router-link></li>
      <li><router-link to="/configuracion" class="menu-link" @click="emitToggleMenu"><i class="bi bi-gear"></i> Configuración</router-link></li>
      <li><router-link to="/perfil" class="menu-link" @click="emitToggleMenu"><i class="bi bi-person-circle"></i> Mi Perfil</router-link></li>
      <li><router-link to="/ayuda" class="menu-link" @click="emitToggleMenu"><i class="bi bi-question-circle"></i> Ayuda y Soporte</router-link></li>
      <li>
        <button class="logout-btn" @click="logout">
          <i class="bi bi-box-arrow-right"></i> Cerrar sesión
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isMenuOpen: Boolean
});

const emit = defineEmits(['toggleMenu']);
const router = useRouter();

const emitToggleMenu = () => {
  emit('toggleMenu');
};

const logout = () => {
  sessionStorage.removeItem('usuario');
  router.push('/login');
  emitToggleMenu();
};
</script>

<style scoped>

/* ✅ Sidebar */
.sidebar {
  position: fixed;
  left: -260px;
  top: 0;
  width: 260px;
  height: 100vh;
  background-color: #2C3E50; /* Color mejorado */
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease-in-out;
  z-index: 1050;
  padding-top: 10px;
}

.sidebar.show {
  left: 0;
}

/* ✅ Encabezado del Sidebar */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #FFB400;
}

/* ✅ Menú del Sidebar */
.sidebar-menu {
  list-style: none;
  padding: 15px;
}

.sidebar-menu li {
  margin: 10px 0;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 1rem;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.menu-link i {
  margin-right: 10px;
}

.menu-link:hover {
  background-color: #1E3A5F;
  color: #FFB400;
}

/* ✅ Botón de Cerrar Sesión */
.logout-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 15px;
}

.logout-btn:hover {
  background: #D94A4A;
}
</style>