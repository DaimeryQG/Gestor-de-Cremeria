<template>
    <div class="container-fluid">
        <!-- Formulario de Búsqueda -->
        <div class="card p-3 mb-4 search-card text-center">
            <form @submit.prevent="searchProvider"
                class="d-flex align-items-center justify-content-center flex-wrap gap-3">
                <div class="search-group d-flex align-items-center">
                    <label for="searchOption" class="text-white mr-2 mb-0">Buscar por:</label>
                    <select v-model="searchOption" id="searchOption" class="form-control custom-input">
                        <option value="nombre">Nombre</option>
                        <option value="telefono">Teléfono</option>
                        <option value="correo">Correo</option>
                        <option value="direccion">Dirección</option>
                        <option value="activo">Activo</option>
                    </select>
                </div>

                <div class="search-group d-flex align-items-center">
                    <label for="searchTerm" class="text-white mr-2 mb-0">Término:</label>
                    <input v-if="searchOption !== 'activo'" v-model="searchTerm" type="text"
                        class="form-control custom-input" placeholder="Ingrese el valor">
                    <select v-else v-model="searchTerm" class="form-control custom-input">
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

                <div class="button-group d-flex gap-2">
                    <button type="submit" class="btn btn-sidebar">Buscar</button>
                    <button type="button" class="btn btn-sidebar" @click="showCreateModal = true">Crear Proveedor</button>
                    <button type="button" class="btn btn-sidebar" @click="generarPDFProveedores">Generar PDF</button>
                </div>
            </form>

        </div>

        <!-- Lista de Proveedores -->
        <div class="row">
            <div class="col-md-4 col-sm-6 col-12 mb-4" v-for="provider in providerList" :key="provider.proveedorId">
                <div class="card h-100 shadow-sm user-card" @click="openProviderPanel(provider)">
                    <div class="card-body">
                        <h5 class="card-title">{{ provider.nombre }}</h5>
                        <p class="card-text">{{ provider.correo }}</p>
                    </div>
                </div>
            </div>

            <!-- Mensaje si no hay proveedores -->
            <div v-if="providerList.length === 0" class="col-12 text-center mt-4">
                <h4>No se encontraron proveedores.</h4>
            </div>
        </div>

        <!-- Modal Editar Proveedor -->
        <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content rounded shadow">
                    <div class="modal-header text-white rounded-top">
                        <h5 class="modal-title"><i class="fas fa-user-edit mr-2"></i>Editar Proveedor</h5>
                        <button type="button" class="btn-x-custom" @click="closeEditModal">&#10005;</button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <form @submit.prevent="updateProvider(editProviderData.proveedorId, editProviderData)">
                            <!-- Nombre -->
                            <div class="form-group d-flex align-items-center mb-3">
                                <label class="col-md-4 text-md-right">Nombre:</label>
                                <input v-model="editProviderData.nombre" type="text" class="form-control col-md-8"
                                    required>
                            </div>

                            <!-- Correo -->
                            <div class="form-group d-flex align-items-center mb-3">
                                <label class="col-md-4 text-md-right">Correo:</label>
                                <input v-model="editProviderData.correo" type="email" class="form-control col-md-8"
                                    required>
                            </div>

                            <!-- Teléfono -->
                            <div class="form-group d-flex align-items-center mb-3">
                                <label class="col-md-4 text-md-right">Teléfono:</label>
                                <input v-model="editProviderData.telefono" type="tel" class="form-control col-md-8">
                            </div>

                            <!-- Dirección -->
                            <div class="form-group d-flex align-items-center mb-3">
                                <label class="col-md-4 text-md-right">Dirección:</label>
                                <input v-model="editProviderData.direccion" type="text" class="form-control col-md-8">
                            </div>

                            <!-- Estado (Activo/Inactivo) -->
                            <div class="form-group d-flex align-items-center mb-3">
                                <label class="col-md-4 text-md-right">Estado:</label>
                                <button type="button" class="btn btn-warning col-md-8" @click="toggleProviderStatus">
                                    {{ editProviderData.activo ? 'Desactivar' : 'Activar' }}
                                </button>
                            </div>

                            <!-- Botones -->
                            <div class="modal-footer bg-light border-0 d-flex flex-wrap gap-2">
                                <button type="submit" class="btn btn-success shadow-sm">Guardar Cambios</button>
                                <button type="button" class="btn btn-danger shadow-sm"
                                    @click="confirmDeleteProvider(editProviderData)">Eliminar</button>
                                <button type="button" class="btn btn-secondary shadow-sm"
                                    @click="closeEditModal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmar Eliminación -->
        <div v-if="showDeleteModal" class="modal d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Confirmar Eliminación</h5>
                        <button type="button" class="close"
                            @click="showDeleteModal = false"><span>&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro que deseas eliminar este proveedor?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="deleteProvider">Eliminar</button>
                        <button type="button" class="btn btn-secondary"
                            @click="showDeleteModal = false">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Crear Proveedor -->
        <div v-if="showCreateModal" class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content rounded shadow">
                    <div class="modal-header text-white rounded-top">
                        <h5 class="modal-title"><i class="fas fa-user-plus mr-2"></i>Crear Nuevo Proveedor</h5>
                        <button type="button" class="btn-x-custom" @click="showCreateModal = false">&#10005;</button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <form @submit.prevent="createProvider">
                            <div class="form-group d-flex align-items-center mb-3">
                                <label for="nombre" class="col-md-4 text-md-right">Nombre:</label>
                                <input v-model="newProvider.nombre" type="text" id="nombre"
                                    class="form-control col-md-8" required>
                            </div>

                            <div class="form-group d-flex align-items-center mb-3">
                                <label for="correo" class="col-md-4 text-md-right">Correo:</label>
                                <input v-model="newProvider.correo" type="email" id="correo"
                                    class="form-control col-md-8" required>
                            </div>

                            <div class="form-group d-flex align-items-center mb-3">
                                <label for="telefono" class="col-md-4 text-md-right">Teléfono:</label>
                                <input v-model="newProvider.telefono" type="tel" id="telefono"
                                    class="form-control col-md-8">
                            </div>

                            <div class="form-group d-flex align-items-center mb-3">
                                <label for="direccion" class="col-md-4 text-md-right">Dirección:</label>
                                <input v-model="newProvider.direccion" type="text" id="direccion"
                                    class="form-control col-md-8">
                            </div>

                            <div class="modal-footer bg-light border-0">
                                <button type="submit" class="btn btn-success shadow-sm">Crear</button>
                                <button type="button" class="btn btn-secondary shadow-sm"
                                    @click="showCreateModal = false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {
    obtenerProveedores,
    crearProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor,
    activarProveedor,
    desactivarProveedor
} from '@/services/ProveedorService.js';
import { generarProveedoresPDF } from '@/utils/PdfProveedor.js';

export default {
    data() {
        return {
            searchOption: 'nombre',  // Opción de búsqueda por defecto
            searchTerm: '',  // Término de búsqueda
            providerList: [], // Lista de proveedores
            newProvider: {
                nombre: '',
                telefono: '',
                correo: '',
                direccion: '',
                estado: '',
                activo: true,
            },
            editProviderData: {}, // Datos del proveedor para editar
            searchOption: 'nombre', // Opción de búsqueda
            searchTerm: '', // Término de búsqueda
            showCreateModal: false, // Control de la visibilidad del modal para crear proveedor
            showEditModal: false, // Control de la visibilidad del modal para editar proveedor
            showDeleteModal: false, // Control de la visibilidad del modal para confirmar eliminación
        };
    },
    mounted() {
        this.obtenerProveedores(); // Cargar la lista de proveedores al montar el componente
    },
    methods: {
        // Obtener la lista de proveedores
        async obtenerProveedores() {
            try {
                this.providerList = await obtenerProveedores();
            } catch (error) {
                console.error('Error al obtener proveedores:', error);
            }
        },

        // Crear un nuevo proveedor
        async createProvider() {
            try {
                await crearProveedor(this.newProvider);
                this.obtenerProveedores(); // Refrescar la lista de proveedores
                this.showCreateModal = false; // Cerrar el modal
            } catch (error) {
                console.error('Error al crear proveedor:', error);
            }
        },

        // Editar un proveedor
        async updateProvider(id, provider) {
            try {
                await actualizarProveedor(id, provider);
                this.obtenerProveedores(); // Refrescar la lista de proveedores
                this.showEditModal = false; // Cerrar el modal de edición
            } catch (error) {
                console.error('Error al actualizar proveedor:', error);
            }
        },

        // Eliminar un proveedor
        async deleteProvider() {
            try {
                await eliminarProveedor(this.editProviderData.proveedorId);
                this.obtenerProveedores(); // Refrescar la lista de proveedores
                this.showDeleteModal = false; // Cerrar el modal de eliminación
            } catch (error) {
                console.error('Error al eliminar proveedor:', error);
            }
        },

        // Activar proveedor
        async activateProvider(id) {
            try {
                await activarProveedor(id);
                this.obtenerProveedores(); // Refrescar la lista de proveedores
            } catch (error) {
                console.error('Error al activar proveedor:', error);
            }
        },

        // Desactivar proveedor
        async deactivateProvider(id) {
            try {
                await desactivarProveedor(id);
                this.obtenerProveedores(); // Refrescar la lista de proveedores
            } catch (error) {
                console.error('Error al desactivar proveedor:', error);
            }
        },

        // Cambiar el estado (activo/inactivo) de un proveedor
        toggleProviderStatus() {
            if (this.editProviderData.activo) {
                this.deactivateProvider(this.editProviderData.proveedorId);
            } else {
                this.activateProvider(this.editProviderData.proveedorId);
            }
        },

        // Buscar proveedores
        async searchProvider() {
            try {
                const filtros = {
                    campo: this.searchOption,
                    valor: this.searchTerm,
                };

                const response = await fetch('http://localhost:8081/proveedores/buscar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filtros),
                });

                if (!response.ok) {
                    throw new Error('Error al buscar proveedores');
                }

                const data = await response.json();
                this.providerList = data;
            } catch (error) {
                console.error('Error al buscar proveedores:', error);
                // Opcionalmente mostrar un mensaje de error
            }
        },

        async generarPDFProveedores() {
    try {
      const proveedores = await obtenerProveedores();  // Obtener los proveedores
      const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));  // Obtener datos del usuario
      const campo = this.searchOption;  // El campo de búsqueda actual
      const valor = this.searchTerm;  // El valor de búsqueda actual

      generarProveedoresPDF(proveedores, usuarioActual, campo, valor);  // Generar PDF
    } catch (error) {
      console.error('Error al generar el PDF de proveedores:', error);
    }
  },

        // Abrir el panel para editar un proveedor
        openProviderPanel(provider) {
            this.editProviderData = { ...provider };
            this.showEditModal = true; // Mostrar modal de edición
        },

        // Cerrar el modal de edición
        closeEditModal() {
            this.showEditModal = false;
            this.editProviderData = {};
        },

        // Abrir el modal de creación
        openCreateModal() {
            this.showCreateModal = true;
        },

        // Cerrar el modal de creación
        closeCreateModal() {
            this.showCreateModal = false;
            this.newProvider = { // Resetear el formulario de nuevo proveedor
                nombre: '',
                telefono: '',
                correo: '',
                direccion: '',
                estado: '',
                activo: true,
            };
        },
    },
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.buttons-group button:first-child {
    margin-right: 2rem;
}

/* --------- Tarjetas Proveedor --------- */
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

/* --------- Panel Proveedor --------- */
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