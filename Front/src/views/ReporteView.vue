<template>
  <div class="container-fluid">
    <div class="card p-3 mb-4 search-card text-center">
      <div class="button-group d-flex justify-content-center">
        <button type="button" class="btn btn-sidebar" @click="generarPDF">
          📄 Generar Reporte General
        </button>
      </div>
    </div>

    <!-- ✅ Canvas fuera del v-if y visible solo para la generación -->
    <div style="position: absolute; top: -9999px; left: -9999px;">
      <canvas id="grafica-ventas" width="600" height="300"></canvas>
    </div>
  </div>
</template>

<script>
import LogicReporte from '@/js/Reporte.js';
export default LogicReporte;
</script>
<style scoped>
.container-fluid {
    padding-top: 0;
    margin-top: 0 !important;
    width: 100%;
  }
  
  /* Tarjeta centrada con fondo personalizado */
  .search-card {
    background-color: #3E4E50;
    color: white;
    margin: 0 auto 1rem auto;
    border-radius: 12px;
    max-width: fit-content;
    padding: 1.5rem 2.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  /* Botón con estilo personalizado */
  .button-group .btn-sidebar {
    background-color: #FFB400;
    color: white;
    padding: 0.5rem 1.2rem;
    border-radius: 12px;
    border: none;
    transition: transform 0.2s, box-shadow 0.2s;
    font-size: 1.1rem;
  }
  
  .button-group .btn-sidebar:hover {
    background-color: #6d5f3e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
</style>
