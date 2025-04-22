<template>
    <div class="container mt-4">
      <div class="card shadow p-4">
        <h2 class="text-center text-primary">Bienvenido, {{ username }} 🎉</h2>
        <p class="text-center">Este es tu panel principal. Aquí puedes ver un resumen de tus actividades.</p>
  
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="card stat-card text-center">
              <i class="bi bi-cart fs-1 text-primary"></i>
              <h4>Ventas</h4>
              <p>Consulta tus ventas recientes.</p>
              <router-link to="/ventas" class="btn btn-primary">Ir a Ventas</router-link>
            </div>
          </div>
  
          <div class="col-md-4">
            <div class="card stat-card text-center">
              <i class="bi bi-box fs-1 text-success"></i>
              <h4>Inventario</h4>
              <p>Administra tus productos y stock.</p>
              <router-link to="/productos" class="btn btn-success">Ir a Inventario</router-link>
            </div>
          </div>
  
          <div class="col-md-4">
            <div class="card stat-card text-center">
              <i class="bi bi-bar-chart fs-1 text-warning"></i>
              <h4>Estadísticas</h4>
              <p>Consulta reportes y análisis.</p>
              <router-link to="/estadisticas" class="btn btn-warning">Ver Reportes</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import useDashboard from '@/js/dashboard.js';
  
  export default {
    setup() {
      return useDashboard();
    }
  };
  </script>
  
  <style scoped>
  </style>
  