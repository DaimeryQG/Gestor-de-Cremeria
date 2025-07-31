<template>
  <div class="container-fluid">
    <!-- Formulario de Búsqueda -->
    <div class="card p-3 mb-4 search-card text-center">
      <form @submit.prevent="searchProduct" class="d-flex align-items-center justify-content-between flex-wrap gap-3">

        <div class="search-group d-flex align-items-center">
          <label for="searchOption" class="text-white mb-0 mr-2">Buscar por:</label>
          <select v-model="searchOption" id="searchOption" class="form-control custom-input">
            <option value="nombre">Nombre</option>
            <option value="descripcion">Descripción</option>
            <option value="precio">Precio</option>
            <option value="stock">Stock</option>
            <option value="categoria">Categoría</option>
            <option value="proveedor">Proveedor</option>
            <option value="fechaCaducidad">Fecha de Caducidad</option>
            <option value="activo">Activo</option>
          </select>
        </div>

        <div class="search-group d-flex align-items-center">
          <label for="searchTerm" class="text-white mr-2 mb-0">Término:</label>
          <template v-if="searchOption === 'activo'">
            <select v-model="searchTerm" class="form-control custom-input">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </template>
          <template v-else-if="searchOption === 'proveedor'">
            <select v-model="searchTerm" class="form-control custom-input">
              <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.nombre">{{ proveedor.nombre
                }}</option>
            </select>
          </template>
          <template v-else-if="searchOption === 'categoria'">
            <select v-model="searchTerm" class="form-control custom-input">
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.nombre">{{ categoria.nombre
                }}</option>
            </select>
          </template>
          <template v-else>
            <input v-model="searchTerm" :type="isNumberField ? 'number' : 'text'" class="form-control custom-input"
              placeholder="Ingrese el valor">
          </template>
        </div>

        <div class="button-group d-flex gap-2">
          <button type="submit" class="btn btn-sidebar">Buscar</button>
          <button type="button" class="btn btn-sidebar" @click="openCreateModal">Crear Producto</button>
          <button type="button" class="btn btn-sidebar" @click="generarPDFProductos">Generar PDF</button>
        </div>

      </form>
    </div>

    <!-- Lista de Productos -->
    <div class="row">
      <div class="col-md-4 col-sm-6 col-12 mb-4" v-for="product in productList" :key="product.productoId">
        <div class="card h-100 shadow-sm user-card" @click="openEditModal(product)">
          <div class="card-body">
            <h5 class="card-title">{{ product.nombre }}</h5>
            <p class="card-text">{{ product.descripcion }}</p>
            <p class="card-text">Precio: ${{ product.precio.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay productos -->
      <div v-if="productList.length === 0" class="col-12 text-center mt-4">
        <h4>No se encontraron productos.</h4>
      </div>
    </div>

    <!-- Modal Crear Producto -->
    <div v-if="showCreateModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content rounded shadow">
          <div class="modal-header text-white rounded-top">
            <h5 class="modal-title"><i class="fas fa-box-open mr-2"></i>Crear Nuevo Producto</h5>
            <button type="button" class="btn-x-custom" @click="closeCreateModal">&#10005;</button>
          </div>
          <div class="modal-body p-4 bg-light">
            <form @submit.prevent="createProduct">
              <!-- Campos del formulario de Crear Producto -->
              <div class="form-group d-flex align-items-center mb-3">
                <label for="nombre" class="col-md-4 text-md-right">Nombre:</label>
                <input v-model="formData.nombre" type="text" id="nombre" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="descripcion" class="col-md-4 text-md-right">Descripción:</label>
                <input v-model="formData.descripcion" type="text" id="descripcion" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="precio" class="col-md-4 text-md-right">Precio:</label>
                <input v-model="formData.precio" type="number" id="precio" class="form-control col-md-8" step="0.01"
                  required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="stock" class="col-md-4 text-md-right">Stock:</label>
                <input v-model="formData.stock" type="number" id="stock" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="categoria" class="col-md-4 text-md-right">Categoría:</label>
                <select v-model="formData.categoria" id="categoria" class="form-control col-md-8" required>
                  <option v-for="categoria in categorias" :key="categoria.categoriaId" :value="categoria">
                    {{ categoria.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="proveedor" class="col-md-4 text-md-right">Proveedor:</label>
                <select v-model="formData.proveedor" id="proveedor" class="form-control col-md-8" required>
                  <option v-for="proveedor in proveedores" :key="proveedor.proveedorId" :value="proveedor">{{ proveedor.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="fechaCaducidad" class="col-md-4 text-md-right">Fecha de Caducidad:</label>
                <input v-model="formData.fechaCaducidad" type="date" id="fechaCaducidad" class="form-control col-md-8"
                  required>
              </div>

              <div class="modal-footer bg-light border-0 d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-success shadow-sm">Crear Producto</button>
                <button type="button" class="btn btn-secondary shadow-sm" @click="closeCreateModal">Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Producto -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content rounded shadow">
          <div class="modal-header text-white rounded-top">
            <h5 class="modal-title"><i class="fas fa-box-open mr-2"></i>Editar Producto</h5>
            <button type="button" class="btn-x-custom" @click="closeEditModal">&#10005;</button>
          </div>
          <div class="modal-body p-4 bg-light">
            <form @submit.prevent="updateProduct">
              <!-- Campos del formulario de Editar Producto -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Nombre:</label>
                <input v-model="formData.nombre" type="text" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Descripción:</label>
                <input v-model="formData.descripcion" type="text" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Precio:</label>
                <input v-model="formData.precio" type="number" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Stock:</label>
                <input v-model="formData.stock" type="number" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Categoría:</label>
                <select v-model="formData.categoria" class="form-control col-md-8" required>
                  <option v-for="categoria in categorias" :key="categoria.categoriaId" :value="categoria">{{ categoria.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Proveedor:</label>
                <select v-model="formData.proveedor" class="form-control col-md-8" required>
                  <option v-for="proveedor in proveedores" :key="proveedor.proveedorId" :value="proveedor">{{ proveedor.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Fecha de Caducidad:</label>
                <input v-model="formData.fechaCaducidad" type="date" class="form-control col-md-8" required>
              </div>

              <!-- Activar/Desactivar Producto -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Estado:</label>
                <button type="button" class="btn btn-warning col-md-8" @click="toggleProductStatus">
                  {{ formData.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </div>

              <div class="modal-footer bg-light border-0 d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-success shadow-sm">Guardar Cambios</button>
                <button type="button" class="btn btn-danger shadow-sm" @click="confirmDelete">Eliminar</button>
                <button type="button" class="btn btn-secondary shadow-sm" @click="closeEditModal">Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Importa los servicios necesarios
import { obtenerCategorias } from '@/services/CategoriaService.js';
import { obtenerProveedores } from '@/services/ProveedorService.js';
import { buscarProductos, obtenerTodosProductos, crearProducto, actualizarProducto, eliminarProducto, activarProducto, desactivarProducto } from '@/services/ProductoService.js';
import { generarProductosPDF } from '@/utils/PdfProducto.js';

export default {
  data() {
    return {
      searchOption: 'nombre',
      searchTerm: '',
      productList: [],
      categorias: [],
      proveedores: [],
      showCreateModal: false,
      showEditModal: false,
      formData: {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoria: '',
        proveedor: '',
        fechaCaducidad: '',
        activo: false,
      },
      productToEdit: null,
    };
  },
  async created() {
    // Cargar las categorías y proveedores al inicio
    this.categorias = await obtenerCategorias();
    this.proveedores = await obtenerProveedores();
    this.obtenerProductos(); // Cargar productos al iniciar
  },
  methods: {
    async searchProduct() {
      try {
        if (!this.searchTerm) {
          this.obtenerProductos(); // Si no hay término, mostrar todos los productos
        } else {
          const response = await buscarProductos(this.searchOption, this.searchTerm);
          this.productList = response;
        }
      } catch (error) {
        console.error('Error al buscar productos:', error);
      }
    },

    async obtenerProductos() {
      try {
        const response = await obtenerTodosProductos();
        console.log("Productos obtenidos en Vue:", response); 
        this.productList = response;
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.resetForm();
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.resetForm();
    },

    resetForm() {
      this.formData = {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoria: '',
        proveedor: '',
        fechaCaducidad: '',
        activo: false,
      };
    },

    async createProduct() {
      try {
        const response = await crearProducto(this.formData);
        this.productList.push(response);
        this.closeCreateModal();
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    },

    openEditModal(product) {
      this.productToEdit = { ...product };
      this.formData = { ...product };
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.resetForm();
    },

    async updateProduct() {
      try {
        const response = await actualizarProducto(this.productToEdit.productoId, this.formData);
        const index = this.productList.findIndex(p => p.productoId === response.productoId);
        if (index !== -1) {
          this.productList.splice(index, 1, response);
        }
        this.closeEditModal();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    },

    async confirmDelete() {
      try {
        await eliminarProducto(this.productToEdit.productoId);
        this.productList = this.productList.filter(p => p.productoId !== this.productToEdit.productoId);
        this.closeEditModal();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    },

    // Función para activar o desactivar producto
    async toggleProductStatus() {
      try {
        if (this.formData.activo) {
          // Desactivar producto
          await desactivarProducto(this.formData.productoId);
          this.formData.activo = false;
        } else {
          // Activar producto
          await activarProducto(this.formData.productoId);
          this.formData.activo = true;
        }
      } catch (error) {
        console.error('Error al cambiar el estado del producto:', error);
      }
    },

    // Método para generar el PDF de los productos
    async generarPDFProductos() {
      if (!this.searchTerm && this.searchOption !== 'activo') {
        alert('Por favor, ingresa un término de búsqueda válido.');
        return;
      }

      try {
        const valor = (this.searchOption === 'activo') ? this.searchTerm : this.searchTerm.trim();
        const productos = await buscarProductos(this.searchOption, valor);

        if (!productos || productos.length === 0) {
          alert('No se encontraron productos para generar el PDF.');
          return;
        }

        const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));

        if (!usuarioActual) {
          alert('No se encontraron datos del usuario.');
          return;
        }

        generarProductosPDF(productos, usuarioActual, this.searchOption, valor);
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        alert('Hubo un error al generar el PDF. Revisa la consola para más detalles.');
      }
    }
  }
};
</script>

<style scoped>
.container-fluid {
  padding-top: 0;
  margin-top: 0 !important;
  width: 100%;
}

.text-white {
  color: white !important;
}

/* --------- Búsqueda Card --------- */
.search-card {
  background-color: #3E4E50;
  color: white;
  margin: 0 auto 1rem auto;
  border-radius: 12px;
  max-width: fit-content;
  padding: 1.5rem 2.5rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.custom-input {
  border-radius: 12px;
  padding: 0.5rem 0.9rem;
  min-width: 160px;
}

.search-group label {
  font-weight: bold;
  white-space: nowrap;
  margin-right: 10px;
}

.search-group .custom-input {
  width: 190px;
}

.button-group .btn-sidebar {
  background-color: #FFB400;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.button-group .btn-sidebar:hover {
  background-color: #6d5f3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.gap-2 {
  gap: 0.75rem;
}

.gap-3 {
  gap: 1rem;
}

.btn-sidebar {
  background-color: #FFB400;
  color: white;
  border: none;
  transition: transform 0.2s;
}

.btn-sidebar:hover {
  background-color: #6d5f3e;
  transform: translateY(-2px);
}

.buttons-group button:first-child {
  margin-right: 2rem;
}

/* --------- Tarjetas Producto --------- */
.user-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease-in-out;
  border-radius: 20px;
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background-color: #2c3e50;
  text-align: center;
  padding: 1.5rem;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.user-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.card-text {
  color: #ffffff;
  font-size: 0.95rem;
}

.row>div {
  padding: 1rem;
}

@media (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

/* --------- Panel Usuario --------- */
.user-panel {
  width: 300px;
  background-color: #f8f9fa;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  padding: 1rem;
}

/* --------- Modal Estilos --------- */
.modal-lg {
  max-width: 580px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-dialog {
  max-width: 660px;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  min-height: 100vh;
  /* CENTRAR VERTICAL */
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: visible;
  max-height: 90vh;
  /* Limita altura para no generar scroll */
}

.modal-header {
  background-color: #3E4E50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-weight: bold;
  font-size: 1.3rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  background-color: #f8f9fa;
  padding: 1rem 2rem;
  border-top: none;
  flex-wrap: wrap;
  gap: 0.8rem;
}

/* --------- Form Inputs --------- */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group label {
  width: 150px;
  text-align: right;
  margin-right: 10px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  flex: 1;
  padding: 0.55rem 0.75rem;
  border-radius: 12px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #FFB400;
  box-shadow: 0 0 6px rgba(255, 180, 0, 0.5);
}

/* --------- Botones --------- */
.btn-success,
.btn-secondary,
.btn-danger,
.btn-warning {
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-success {
  background-color: #FFB400;
  color: white;
}

.btn-success:hover {
  background-color: #d49e00;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.btn-warning {
  background-color: #f0ad4e;
  color: white;
}

.btn-warning:hover {
  background-color: #ec971f;
  transform: translateY(-2px);
}

.btn-x-custom {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-x-custom:hover {
  color: #FFB400;
}

body.modal-open {
  overflow: hidden !important;
  padding-right: 0px !important;
}

body {
  zoom: 67%;
}
</style>
