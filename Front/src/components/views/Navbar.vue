<template>
  <nav class="navbar">
    <div class="container-fluid">
      <h1 class="navbar-title">Sistema de Control de Inventario</h1>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent'
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background: #1E3A5F;
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-title {
  font-size: 1.5rem;
  margin: 0 auto;
  text-align: center;
}
</style>