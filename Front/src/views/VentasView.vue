<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4"><i class="fas fa-shopping-cart"></i> Gestión de Ventas</h2>

    <!-- Formulario de Venta -->
    <div class="form-container p-4 border rounded shadow-sm bg-light">
      <div class="form-row align-items-end">
        <div class="form-group col-md-6">
          <label>Producto:</label>
          <select v-model="productoSeleccionado" class="form-control" required>
            <option value="">Seleccione un producto</option>
            <option v-for="prod in productos" :key="prod.productoId" :value="prod">
              {{ prod.nombre }} - ${{ prod.precio.toFixed(2) }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <label>Cantidad:</label>
          <input type="number" v-model.number="cantidad" class="form-control" min="1" required />
        </div>
        <div class="form-group col-md-2 text-center">
          <button class="btn btn-primary btn-block" @click="agregarProducto">
            <i class="fas fa-plus"></i> Agregar
          </button>
        </div>
      </div>
    </div>

    <!-- Detalle de Venta -->
    <h3 class="text-center mt-4"><i class="fas fa-list-alt"></i> Detalle de Venta</h3>
    <table class="table table-bordered table-striped mt-3">
      <thead class="thead-dark">
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(detalle, index) in detallesVenta" :key="index">
          <td>{{ detalle.producto.nombre }}</td>
          <td>{{ detalle.cantidad }}</td>
          <td>${{ detalle.precioUnitario.toFixed(2) }}</td>
          <td>${{ detalle.subtotal.toFixed(2) }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="eliminarProducto(index)">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Total y botón -->
    <div class="d-flex justify-content-between align-items-center">
      <h4 class="font-weight-bold">Total: ${{ totalVenta.toFixed(2) }}</h4>
      <button class="btn btn-success" @click="registrarVenta">
        <i class="fas fa-check"></i> Registrar Venta
      </button>
    </div>

    <!-- Historial -->
    <h2 class="text-center mt-5"><i class="fas fa-history"></i> Historial de Ventas</h2>
    <div class="row my-3">
      <div class="col-md-5">
        <label>Fecha de Inicio:</label>
        <input type="datetime-local" v-model="fechaInicio" class="form-control" />
      </div>
      <div class="col-md-5">
        <label>Fecha de Fin:</label>
        <input type="datetime-local" v-model="fechaFin" class="form-control" />
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-danger w-100" @click="generarPDF">
          <i class="fas fa-file-pdf"></i> Descargar PDF
        </button>
      </div>
    </div>

    <table class="table table-bordered table-striped mt-3">
      <thead class="thead-dark">
        <tr>
          <th>ID Venta</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="venta in historialVentas" :key="venta.ventaId">
          <td>{{ venta.ventaId }}</td>
          <td>{{ venta.usuario }}</td>
          <td>{{ venta.rol }}</td>
          <td>{{ new Date(venta.fechaVenta).toLocaleString() }}</td>
          <td>${{ venta.total }}</td>
          <td>
            <button class="btn btn-info btn-sm" @click="verDetallesVenta(venta)">Ver</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal éxito -->
    <div v-if="showSuccessModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">✅ Venta Registrada</h5>
            <button type="button" class="close btn-x-custom" @click="showSuccessModal = false">
              &#10005;
            </button>
          </div>
          <div class="modal-body">
            ¡La venta fue registrada correctamente!
          </div>
          <div class="modal-footer bg-light border-0">
            <button type="button" class="btn btn-success" @click="showSuccessModal = false">Aceptar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalles -->
    <div v-if="ventaSeleccionada" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Detalle de Venta #{{ ventaSeleccionada.ventaId }}</h5>
            <button type="button" class="close btn-x-custom" @click="ventaSeleccionada = null">
              &#10005;
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Usuario:</strong> {{ ventaSeleccionada.usuario }}</p>
            <p><strong>Rol:</strong> {{ ventaSeleccionada.rol }}</p>
            <p><strong>Fecha:</strong> {{ new Date(ventaSeleccionada.fechaVenta).toLocaleString() }}</p>
            <p><strong>Total:</strong> ${{ ventaSeleccionada.total.toFixed(2) }}</p>
            <hr />
            <h5>Productos Vendidos:</h5>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detalle in ventaSeleccionada.detalles" :key="detalle.detalleId">
                  <td>{{ detalle.producto.nombre }}</td>
                  <td>{{ detalle.cantidad }}</td>
                  <td>${{ detalle.precioUnitario.toFixed(2) }}</td>
                  <td>${{ detalle.subtotal.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="ventaSeleccionada = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import useVentas from '@/js/Ventas.js';

export default {
  setup() {
    return useVentas();
  }
};
</script>

<style scoped>
/* General */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
}

/* Títulos */
h2, h3 {
  color: #2c3e50;
  font-weight: bold;
}

h2 i, h3 i {
  margin-right: 10px;
  color: #FFB400;
}

/* Formulario de Venta */
.form-container {
  background-color: #f9f9f9;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-container label {
  font-weight: bold;
}

.form-control {
  border-radius: 12px;
}

.btn-primary {
  background-color: #FFB400;
  border: none;
  border-radius: 12px;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: #d49e00;
  transform: translateY(-2px);
}

/* Tabla Detalle */
.table th {
  background-color: #2c3e50;
  color: white;
}

.table td, .table th {
  vertical-align: middle;
  text-align: center;
}

.btn-danger {
  border-radius: 8px;
  transition: 0.3s;
}

.btn-danger:hover {
  transform: scale(1.05);
}

/* Total */
.font-weight-bold {
  color: #2c3e50;
}

/* Botón Registrar */
.btn-success {
  background-color: #28a745;
  border-radius: 12px;
  transition: 0.3s;
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  background-color: #218838;
}

/* Historial */
.row label {
  font-weight: bold;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

/* Modal éxito */
.modal-content {
  border-radius: 16px;
}

.modal-header {
  background-color: #28a745;
  color: white;
}

/* Ocultar Scrollbar pero permitir desplazamiento */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

body {
  -ms-overflow-style: none;  
  scrollbar-width: none;
}
</style>
