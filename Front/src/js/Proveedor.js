import {
    obtenerProveedores,
    crearProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor,
    activarProveedor,
    desactivarProveedor,
    buscarProveedorDinamico
  } from '@/services/ProveedorService.js';
  
  import { generarProveedoresPDF } from '@/utils/PdfProveedor.js';
  
  export default {
    data() {
      return {
        searchOption: 'nombre',  // Opción de búsqueda por defecto
        searchTerms: [{ option: 'nombre', terms: [''] }],  // Términos de búsqueda
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
        showCreateModal: false, // Control de la visibilidad del modal para crear proveedor
        showEditModal: false, // Control de la visibilidad del modal para editar proveedor
        showDeleteModal: false, // Control de la visibilidad del modal para confirmar eliminación
        showSearchModal: false, // Control de la visibilidad del modal de búsqueda
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
  
      // Buscar proveedores con filtros dinámicos
      async searchProvider() {
        const termIsEmpty = this.searchTerms.some(row => row.terms.every(term => !term || !term.trim())); // Asegúrate de verificar si TODOS los términos están vacíos en lugar de solo uno
    
      if (termIsEmpty) {
        alert('Por favor, ingrese un término de búsqueda válido.');
        return;
      }
      
        try {
          const filtros = {};
  
          // Crear los filtros basados en los términos de búsqueda
          this.searchTerms.forEach(row => {
            const validTerms = row.terms.filter(term => term.trim() !== '');  // Filtramos términos vacíos
            if (validTerms.length > 0) {
              filtros[row.option] = validTerms;  // Solo agregamos los términos válidos
            }
          });
  
          // Llamar al servicio de búsqueda dinámica
          const proveedores = await buscarProveedorDinamico(filtros);
          this.providerList = proveedores;
        } catch (error) {
          console.error('Error al buscar proveedores:', error);
        }
      },
  
      // Generar PDF de proveedores
      async generarPDFProveedores() {
        // Verificar que haya proveedores filtrados en la lista
        if (this.providerList.length === 0) {
          alert('No se han encontrado proveedores con los filtros seleccionados.');
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
                // Mostrar "Buscar por" y el valor seleccionado
                return `${row.option}: ${validTerms.join(', ')}`;  // Aquí se unen los términos para mostrar en el filtro
              } else {
                return '';
              }
            })
            .filter(text => text.trim() !== '')  // Filtrar si hay filtros vacíos
            .join(' | ');  // Unir los filtros por ' | '
      
          console.log("Filtro aplicado:", filtroTexto); // Ver en consola para depuración
      
          // Generación del PDF con los proveedores filtrados
          const proveedores = this.providerList;
          const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
      
          // Llamar a la función para generar el PDF con los resultados de la búsqueda
          generarProveedoresPDF(proveedores, usuarioActual, filtroTexto, filtros);
      
        } catch (error) {
          alert('Error al generar el PDF: ' + error.message);
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
  
      // Agregar un nuevo término de búsqueda
      addTerm(rowIndex) {
        this.searchTerms[rowIndex].terms.push('');  // Agregar un nuevo término vacío
      },
  
      // Agregar una nueva fila de búsqueda
      addRow() {
        this.searchTerms.push({ option: 'nombre', terms: [''] });  // Agregar una nueva fila con un término vacío
      },
  
      // Cerrar el modal de búsqueda
      closeSearchModal() {
        this.showSearchModal = false;
        this.searchTerms = [{ option: 'nombre', terms: [''] }];  // Resetear los términos de búsqueda
      },
  
      // Mostrar el modal de búsqueda
      openSearchModal() {
        this.showSearchModal = true;
      }
    },
  };
  