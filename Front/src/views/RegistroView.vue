<template>
  <div class="container-fluid">
    <!-- Botones Principales -->
    <div class="card p-3 mb-4 search-card text-center">
      <div class="button-group d-flex gap-2">
        <button type="submit" class="btn btn-sidebar" @click="showSearchModal = true">Buscar</button>
        <button type="button" class="btn btn-sidebar" @click="showCreateModal = true">Crear Usuario</button>
        <button type="button" class="btn btn-sidebar" @click="generarPDFUsuarios">Generar PDF</button>
      </div>
    </div>

<!-- Modal de Búsqueda -->
<div v-if="showSearchModal" class="modal fade show d-block" @click.self="closeSearchModal">
  <div class="modal-dialog-search" role="document">
    <div class="modal-content">
      <div class="modal-header text-white rounded-top">
        <h5 class="modal-title">Buscar Usuario</h5>
        <button type="button" class="btn-x-custom" @click="closeSearchModal">&#10005;</button>
      </div>
      <div class="modal-body-search-search p-4 bg-light">
        <form @submit.prevent="searchUser">
          <!-- Filtro de búsqueda -->
          <div v-for="(row, rowIndex) in searchTerms" :key="rowIndex" class="form-group">
            <label for="searchOption" class="modal-label">Buscar por:</label>
            <select v-model="row.option" class="form-control custom-input">
              <option value="nombre">Nombre</option>
              <option value="rfc">RFC</option>
              <option value="curp">CURP</option>
              <option value="correo">Correo</option>
              <option value="telefono">Teléfono</option>
              <option value="pais">País</option>
              <option value="estado">Estado</option>
              <option value="username">Username</option>
              <option value="activo">Activo</option> <!-- Aquí se añade "Activo" -->
            </select>

            <label for="searchTerm" class="modal-label">Término:</label>
            <div v-for="(term, termIndex) in row.terms" :key="termIndex" class="d-flex align-items-center">
              <!-- Si la opción seleccionada es "activo", poner opciones predefinidas -->
              <input v-if="row.option !== 'activo'" v-model="row.terms[termIndex]" type="text" class="form-control custom-input" placeholder="Ingrese el valor">
              <select v-if="row.option === 'activo'" v-model="row.terms[termIndex]" class="form-control custom-input">
                <option value="Activo" selected>Activo</option> <!-- Valor predeterminado -->
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <!-- Botón para agregar más términos -->
            <button type="button" class="add-term-btn" @click="addTerm(rowIndex)">+</button>
          </div>

          <!-- Botón para agregar más filas -->
          <button type="button" class="btn btn-warning" @click="addRow">Añadir Fila</button>

          <!-- Botones dentro del modal -->
          <div class="modal-footer bg-light border-0">
            <button type="submit" class="btn btn-sidebar">Buscar</button>
            <button type="button" class="btn btn-secondary shadow-sm" @click="closeSearchModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

    <!-- Lista de Usuarios -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="user in userList" :key="user.id">
        <div class="card h-100 shadow-sm user-card" @click="openUserPanel(user)">
          <div class="card-body">
            <h5 class="card-title">{{ user.nombre }}</h5>
            <p class="card-text">{{ user.correo }}</p>
            <p class="card-text">{{ user.rolNombre }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Usuario -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content rounded shadow">
          <div class="modal-header text-white rounded-top">
            <h5 class="modal-title"><i class="fas fa-user-edit mr-2"></i>Editar Usuario</h5>
            <button type="button" class="btn-x-custom" @click="closeEditModal">
              &#10005;
            </button>
          </div>
          <div class="modal-body p-4 bg-light">
            <form @submit.prevent="updateUser(editUserData.id, editUserData)">
              <!-- Nombre -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Nombre:</label>
                <input type="text" v-model="editUserData.nombre" class="form-control col-md-8" required>
              </div>

              <!-- Correo -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Correo:</label>
                <input type="email" v-model="editUserData.correo" class="form-control col-md-8" required>
              </div>

              <!-- Teléfono -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Teléfono:</label>
                <input type="tel" v-model="editUserData.telefono" class="form-control col-md-8">
              </div>

              <!-- Dirección -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Dirección:</label>
                <input type="text" v-model="editUserData.direccion" class="form-control col-md-8">
              </div>

              <!-- RFC -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">RFC:</label>
                <input type="text" v-model="editUserData.rfc" class="form-control col-md-8">
              </div>

              <!-- CURP -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">CURP:</label>
                <input type="text" v-model="editUserData.curp" class="form-control col-md-8">
              </div>

              <!-- País -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">País:</label>
                <input type="text" v-model="editUserData.pais" class="form-control col-md-8">
              </div>

              <!-- Estado -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Estado:</label>
                <input type="text" v-model="editUserData.estado" class="form-control col-md-8">
              </div>

              <!-- Fecha Registro -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Fecha de Registro:</label>
                <input type="date" v-model="editUserData.fechaRegistro" class="form-control col-md-8">
              </div>

              <!-- Username -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Username:</label>
                <input type="text" v-model="editUserData.username" class="form-control col-md-8" required>
              </div>

              <!-- Password -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Contraseña:</label>
                <input type="password" v-model="editUserData.password" placeholder="****" class="form-control col-md-8">
              </div>

              <!-- Rol -->
              <div class="form-group d-flex align-items-center mb-3">
                <label class="col-md-4 text-md-right">Rol:</label>
                <select v-model="editUserData.rol.id" class="form-control col-md-8" required>
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Proveedor</option>
                  <option value="4">Almacenista</option>
                </select>
              </div>

              <!-- Botones -->
              <div class="modal-footer bg-light border-0 d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-success shadow-sm">Guardar Cambios</button>
                <button type="button" class="btn btn-danger shadow-sm"
                  @click="confirmDelete(editUserData)">Eliminar</button>
                <button type="button" class="btn btn-warning shadow-sm"
                  @click="editUserData.activo ? deactivateUser(editUserData.id) : activateUser(editUserData.id)">
                  {{ editUserData.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button type="button" class="btn btn-secondary shadow-sm" @click="closeEditModal">Cancelar</button>
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
            <button type="button" class="close" @click="showDeleteModal = false">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro que deseas eliminar este usuario?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="deleteUser">Eliminar</button>
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Usuario -->
    <div v-if="showCreateModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content rounded shadow">
          <div class="modal-header text-white rounded-top">
            <h5 class="modal-title"><i class="fas fa-user-plus mr-2"></i>Crear Nuevo Usuario</h5>
            <button type="button" class="btn-x-custom" @click="showCreateModal = false">
              &#10005;
            </button>
          </div>
          <div class="modal-body p-4 bg-light">
            <form @submit.prevent="createUser">
              <div class="form-group d-flex align-items-center mb-3">
                <label for="nombre" class="col-md-4 text-md-right">Nombre:</label>
                <input v-model="newUser.nombre" type="text" id="nombre" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="correo" class="col-md-4 text-md-right">Correo:</label>
                <input v-model="newUser.correo" type="email" id="correo" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="telefono" class="col-md-4 text-md-right">Teléfono:</label>
                <input v-model="newUser.telefono" type="tel" id="telefono" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="direccion" class="col-md-4 text-md-right">Dirección:</label>
                <input v-model="newUser.direccion" type="text" id="direccion" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="rfc" class="col-md-4 text-md-right">RFC:</label>
                <input v-model="newUser.rfc" type="text" id="rfc" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="curp" class="col-md-4 text-md-right">CURP:</label>
                <input v-model="newUser.curp" type="text" id="curp" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="pais" class="col-md-4 text-md-right">País:</label>
                <input v-model="newUser.pais" type="text" id="pais" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="estado" class="col-md-4 text-md-right">Estado:</label>
                <input v-model="newUser.estado" type="text" id="estado" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="fechaRegistro" class="col-md-4 text-md-right">Fecha de Registro:</label>
                <input v-model="newUser.fechaRegistro" type="date" id="fechaRegistro" class="form-control col-md-8">
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="username" class="col-md-4 text-md-right">Username:</label>
                <input v-model="newUser.username" type="text" id="username" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="password" class="col-md-4 text-md-right">Contraseña:</label>
                <input v-model="newUser.password" type="password" id="password" class="form-control col-md-8" required>
              </div>

              <div class="form-group d-flex align-items-center mb-3">
                <label for="rol" class="col-md-4 text-md-right">Rol:</label>
                <select v-model="newUser.rol.id" id="rol" class="form-control col-md-8" required>
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Proveedor</option>
                  <option value="4">Almacenista</option>
                </select>
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
import LogicRegistro from '@/js/Registro.js';

export default LogicRegistro;
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

/* --------- Tarjetas Usuario --------- */
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
}

.modal.fade.show {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.6);
  /* Fondo semitransparente */
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
  max-height: none;
  /* Permitir el crecimiento según el contenido */
  height: auto;
  overflow: visible;
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


/* Estilo general para el formulario de búsqueda */
.modal-body-search form {
  display: flex;
  flex-direction: column;
  /* Los elementos se alinean en una columna */
  gap: 20px;
  /* Espacio entre los elementos */
}

.modal-body-search .d-flex {
  display: flex;
  gap: 20px;
  /* Espacio entre los inputs dentro del contenedor */
}

/* Contenedor de los campos "Buscar por" y "Término" en una sola fila */
.modal-body-search .form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* Ajustes para las etiquetas (labels) más pequeñas */
.modal-body-search .modal-label {
  font-size: 12px;
  /* Hacemos el tamaño de la fuente más pequeño */
  font-weight: bold;
  margin-bottom: 0;
  /* No hay espacio extra debajo de las etiquetas */
  width: 90px;
  /* Ajustamos el tamaño de las etiquetas para que estén alineadas */
}

/* Ajuste de los inputs/selects (hacerlos más pequeños) */
.modal-body-search .custom-input {
  min-width: 150px;
  /* Establecer un ancho mínimo para los inputs */
  max-width: 200px;
  /* Establecer un ancho máximo */
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Botón de agregar más términos */
.modal-body-search-search .add-term-btn {
  background-color: #f39c12;
  border: none;
  padding: 8px;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.modal-body-search-search .add-term-btn:hover {
  background-color: #e67e22;
}

/* Botones dentro del modal */
.modal-body-search .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  /* Espacio entre los botones */
  margin-top: 15px;
}

.modal-body-search button {
  padding: 8px 20px;
  font-size: 14px;
}

/* Ajustar el modal y centrarlo solo para este modal de búsqueda */
.modal-dialog-search {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* Cambiar para que el modal se ajuste al contenido */
  padding: 0;
  width: 100%;
  max-width: 600px;
  /* Tamaño inicial del modal */
  height: auto;
  /* El modal se ajustará a la altura del contenido */
  margin: 0 auto;
  transition: max-width 0.3s ease-in-out, height 0.3s ease-in-out;
  /* Transiciones para ajustar el tamaño */
}

.modal-body-search {
  max-height: none;
  height: auto;
  padding-top: 0.5rem;
}
</style>
