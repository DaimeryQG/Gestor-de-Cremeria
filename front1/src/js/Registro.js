import { 
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
      searchTerms: [{ option: 'nombre', terms: [''] }],
      userList: [],
      showUserPanel: false,
      selectedUser: {},
      showDeleteModal: false,
      showCreateModal: false,
      showSearchModal: false,
      showEditModal: false,
      passwordInputShown: false,
      editUserData: {},
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
      const termIsEmpty = this.searchTerms.some(row => row.terms.every(term => !term || !term.trim())); // Asegúrate de verificar si TODOS los términos están vacíos en lugar de solo uno
    
      if (termIsEmpty) {
        alert('Por favor, ingrese un término de búsqueda válido.');
        return;
      }
    
      try {
        const filtros = {};
    
        // Iterar sobre las filas y añadir los filtros solo si tienen términos no vacíos
        this.searchTerms.forEach(row => {
          const validTerms = row.terms.filter(term => term.trim() !== ''); // Filtramos términos vacíos
    
          if (validTerms.length > 0) {
            if (row.option === 'activo') {
              filtros[row.option] = validTerms[0] === 'Activo' ? ['true'] : ['false']; // Manejamos 'Activo' e 'Inactivo' como 'true' o 'false'
            } else {
              filtros[row.option] = validTerms;
            }
          } else if (row.option === 'activo') {
            filtros[row.option] = ['true']; // Si no se selecciona nada, predeterminado es 'Activo'
          }
        });
    
        const data = await buscarDinamico(filtros); // Llamar a la función que realiza la solicitud POST al backend
        this.userList = data;
    
        // Limpiar los términos de búsqueda
        this.resetSearchFields();
    
        // Cerrar el modal de búsqueda
        this.showSearchModal = false;
    
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

    resetSearchFields() {
      this.searchTerms = [{ option: 'nombre', terms: [''] }]; // Resetear a un solo campo de término vacío
      this.searchOption = 'nombre';  // Restablecer la opción predeterminada
    },

    async generarPDFUsuarios() {
      // Verificar que haya usuarios filtrados en la lista
      if (this.userList.length === 0) {
        alert('No se han encontrado usuarios con los filtros seleccionados.');
        return;
      }
    
      try {
        // Crear el objeto filtros y filtroTexto
        const filtros = {};
    
        // Construcción del filtroTexto
        const filtroTexto = this.searchTerms
          .map(row => {
            // Verificar si hay términos válidos en la fila
            const validTerms = row.terms.filter(term => term.trim() !== '');
            if (validTerms.length > 0) {
              // Si es la opción "activo", mostrar "Activo" o "Inactivo" según el valor de ["true"] o ["false"]
              if (row.option === 'activo') {
                return `${row.option}: ${validTerms[0] === 'true' ? 'Activo' : 'Inactivo'}`;  // Ejemplo: 'activo: Activo'
              } else {
                return `${row.option}: ${validTerms.join(', ')}`;
              }
            } else {
              return '';
            }
          })
          .filter(text => text.trim() !== '')  // Filtrar si hay filtros vacíos
          .join(' | ');  // Unir los filtros por ' | '
    
        console.log("Filtro aplicado:", filtroTexto); // Ver en consola para depuración
    
        // Generación del PDF con los usuarios filtrados
        const usuarios = this.userList;
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    
        // Llamar a la función para generar el PDF con los resultados de la búsqueda
        generarUsuariosPDF(usuarios, usuarioActual, filtroTexto, filtros);
    
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

    // Mostrar el modal
    openSearchModal() {
      this.showSearchModal = true;
    },

    // Cerrar el modal
    closeSearchModal() {
      this.showSearchModal = false;
      this.resetSearchFields();
    },

    addRow() {
      // Agregar una fila con opción predeterminada y términos vacíos
      this.searchTerms.push({ option: 'nombre', terms: [''] });
      this.adjustModalHeight();
    },

    addTerm(rowIndex) {
      // Verificamos si la fila existe y si la propiedad 'terms' está definida correctamente como un array
      if (this.searchTerms[rowIndex] && Array.isArray(this.searchTerms[rowIndex].terms)) {
        // Añadir un nuevo término vacío a la fila especificada
        this.searchTerms[rowIndex].terms.push('');
      } else {
        alert('La fila no existe o no tiene términos.');
      }

      this.adjustModalHeight();
    },

    adjustModalHeight() {
      const modalDialog = document.querySelector('.modal-dialog-search');
      const modalContent = document.querySelector('.modal-content');

      // Ajustar la altura del modal según el contenido
      modalDialog.style.height = 'auto'; // Asegurarse de que el modal pueda expandirse
      modalContent.style.height = 'auto'; // Ajustar el contenido del modal también

      // Reajustar el tamaño de la ventana del modal
      const newHeight = modalDialog.scrollHeight;
      modalDialog.style.height = `${newHeight}px`; // Establecer nueva altura dinámica

      // Agregar una transición suave
      modalDialog.style.transition = 'height 0.3s ease-in-out';
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
