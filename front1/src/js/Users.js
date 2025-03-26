import { 
  buscarRegistros, 
  crearRegistro, 
  actualizarRegistro, 
  eliminarRegistro, 
  activarRegistro, 
  desactivarRegistro,
  obtenerTodos, 
  buscarDinamico
} from '@/services/RegistrosService.js';

import { generarUsuariosPDF } from '@/utils/PdfRegistros.js';

export default {
  data() {
    return {
      searchOption: 'nombre',
      searchTerm: '',
      userList: [],
      showUserPanel: false,
      selectedUser: {},
      showDeleteModal: false,
      showCreateModal: false,
      showEditModal: false, // Modal editar
      passwordInputShown: false,
      editUserData: {},     // Datos usuario para editar
      newUser: {
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        rfc: '',
        curp: '',
        pais: '',
        estado: '',
        fechaRegistro: '',
        username: '',
        password: '',
        rol: { id: 1 },
        activo: true
      }
    };
  },

  mounted() {
    this.cargarUsuarios();
  },

  methods: {
    // Buscar
    async searchUser() {
      if (!this.searchTerm && this.searchOption !== 'activo') {
        alert('Por favor, ingrese un término de búsqueda válido.');
        return;
      }
      try {
        const valor = (this.searchOption === 'activo') ? this.searchTerm : this.searchTerm.trim();
        const data = await buscarRegistros(this.searchOption, valor);
        this.userList = data;
      } catch (error) {
        alert(error.message || 'Error al buscar.');
      }
    },

    // Cargar todos los usuarios
    async cargarUsuarios() {
      try {
        const data = await obtenerTodos();
        this.userList = data;
      } catch (error) {
        alert(error.message || 'Error al cargar usuarios.');
      }
    },

    // Nueva función para generar PDF con el filtro
    async generarPDFUsuarios() {
      if (!this.searchTerm && this.searchOption !== 'activo') {
        alert('Primero realiza una búsqueda válida para generar PDF.');
        return;
      }
      try {
        const valor = (this.searchOption === 'activo') ? this.searchTerm : this.searchTerm.trim();
        const usuarios = await buscarRegistros(this.searchOption, valor);

        const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));

        generarUsuariosPDF(usuarios, usuarioActual, this.searchOption, valor);
      } catch (error) {
        alert('Error al generar el PDF: ' + error.message);
      }
    },

    // Abrir panel de detalles
    openUserPanel(user) {
      let rolId = 1;
      if (user.rolNombre === "ADMINISTRADOR") rolId = 1;
      else if (user.rolNombre === "VENDEDOR") rolId = 2;
      else if (user.rolNombre === "PROVEEDOR") rolId = 3;
      else if (user.rolNombre === "ALMACENISTA") rolId = 4;
    
      this.editUserData = {
        ...user,
        rol: { id: rolId },
        password: '' // ⚠️ Opcional: dejar contraseña vacía (para seguridad)
      };
    
      this.showEditModal = true;
    },

    closeUserPanel() {
      this.showUserPanel = false;
    },

    // Modal Crear
    openCreateForm() {
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.resetNewUser();
    },

    // Crear Usuario
    async createUser() {
      try {
        if (!this.newUser.nombre || !this.newUser.correo || !this.newUser.username || !this.newUser.password) {
          alert('Por favor, complete los campos obligatorios.');
          return;
        }
        await crearRegistro(this.newUser);
        alert('Usuario creado correctamente.');
        this.closeCreateModal();
        await this.cargarUsuarios(); // Refresca lista
      } catch (error) {
        alert(error.message || 'Error al crear usuario.');
      }
    },

    resetNewUser() {
      this.newUser = {
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        rfc: '',
        curp: '',
        pais: '',
        estado: '',
        fechaRegistro: '',
        username: '',
        password: '',
        rol: { id: 1 }
      };
    },

    // Modal Editar
    openEditForm(user) {
      // Mapear rolNombre a id
      let rolId = 1; // default Administrador
      if (user.rolNombre === "ADMINISTRADOR") rolId = 1;
      else if (user.rolNombre === "VENDEDOR") rolId = 2;
      else if (user.rolNombre === "PROVEEDOR") rolId = 3;
      else if (user.rolNombre === "ALMACENISTA") rolId = 4;
    
      this.editUserData = { 
        ...user,
        rol: { id: rolId }
      };
      this.showEditModal = true;
      document.body.classList.add('modal-open');
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editUserData = {};
    },

    async updateUser() {
      try {
        const updatedUser = {
          ...this.editUserData,
          rol: { id: this.editUserData.rol.id }
        };
        await actualizarRegistro(this.editUserData.id, this.editUserData);
        alert('Usuario actualizado correctamente.');
        this.closeEditModal();
        await this.cargarUsuarios();
      } catch (error) {
        alert(error.message || 'Error al actualizar usuario.');
      }
    },

    // Eliminar
    confirmDelete(user) {
      this.selectedUser = user;
      this.showDeleteModal = true;
    },

    async deleteUser() {
      try {
        await eliminarRegistro(this.selectedUser.id);
        this.userList = this.userList.filter(u => u.id !== this.selectedUser.id);
        this.showDeleteModal = false;
        alert('Usuario eliminado correctamente.');
      } catch (error) {
        alert(error.message || 'Error al eliminar usuario.');
      }
    },

    // Activar / Desactivar
    async activateUser(userId) {
      try {
        await activarRegistro(userId);
        alert('Usuario activado correctamente.');
    
        // ⚠️ Actualizamos manualmente el estado del usuario en el modal:
        this.editUserData.activo = true;
    
        await this.cargarUsuarios(); // Opcional, si quieres refrescar la lista
      } catch (error) {
        alert(error.message || 'Error al activar usuario.');
      }
    },

    async deactivateUser(userId) {
      try {
        await desactivarRegistro(userId);
        alert('Usuario desactivado correctamente.');
    
        // ⚠️ Actualizamos manualmente el estado del usuario en el modal:
        this.editUserData.activo = false;
    
        await this.cargarUsuarios(); // Opcional también
      } catch (error) {
        alert(error.message || 'Error al desactivar usuario.');
      }
    }
  }
};
