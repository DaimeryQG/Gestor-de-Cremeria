<template>
  <footer class="footer">
    <p class="footer-text">&copy; 2024 Sistema de Control de Inventario - Todos los derechos reservados</p>
  </footer>
</template>

<style scoped>
.footer {
  background: #2C3E50;
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999; /* Mantenerlo visible pero no tan alto para no interferir */
  opacity: 1;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2); /* Sombra sutil arriba */
}

.footer-text {
  font-size: 0.85rem;
  font-weight: 300;
  text-align: center;
  margin: 0;
  padding: 0;
  color: #ddd;
}

@media (max-width: 768px) {
  .footer-text {
    font-size: 0.75rem;
  }
}
</style>