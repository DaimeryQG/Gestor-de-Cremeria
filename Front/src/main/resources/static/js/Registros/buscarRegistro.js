window.addEventListener("pageshow", () => {
    const searchForm = document.getElementById('searchForm');
    const searchOption = document.getElementById('searchOption');
    const searchInput = document.getElementById('searchInput');
    let activoSelect = document.getElementById('activoSelect');

    // ✅ Crear el select dinámico para "activo" si no existe
    if (!activoSelect) {
        activoSelect = document.createElement('select');
        activoSelect.id = 'activoSelect';
        activoSelect.className = 'form-control';
        activoSelect.style.display = 'none';
        activoSelect.innerHTML = `
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
        `;
        searchInput.parentNode.appendChild(activoSelect);
    }

    // ✅ Establecer "nombre" como opción predeterminada al cargar o volver a la página
    function resetSearchField() {
        searchOption.value = 'nombre';
        searchInput.style.display = 'block';
        activoSelect.style.display = 'none';
        searchInput.placeholder = 'Ingrese el nombre';
        searchInput.value = '';
    }

    resetSearchField();

    // Evento de cambio en el select principal
    searchOption.addEventListener('change', () => {
        manejarCambioCampo();
    });

    // ✅ Manejar cambios entre input y select según el campo seleccionado
    function manejarCambioCampo() {
        if (searchOption.value === 'activo') {
            searchInput.style.display = 'none';
            searchInput.disabled = true; // ✅ Desactivar input oculto
            activoSelect.style.display = 'block';
            activoSelect.disabled = false;
            activoSelect.value = 'true'; // Valor por defecto
        } else {
            searchInput.style.display = 'block';
            searchInput.disabled = false; // ✅ Activar input visible
            activoSelect.style.display = 'none';
            activoSelect.disabled = true;
            searchInput.placeholder = `Ingrese el ${searchOption.value}`;
            searchInput.value = '';
        }
    }

    // Ejecutar al cargar la página para establecer el estado correcto
    manejarCambioCampo();

    // Envío del formulario
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const campo = searchOption.value;
        let valor = (campo === 'activo') ? activoSelect.value : searchInput.value.trim();

        if (!valor) {
            alert('Por favor, ingrese un término de búsqueda válido.');
            return;
        }

        buscarRegistro(campo, valor);
    });

    // Crear nuevo registro
    document.getElementById('createButton').addEventListener('click', function() {
        window.location.href = '/Registro/crearRegistro.html';
    });

    // ✅ Función para buscar el registro
    function buscarRegistro(searchOption, searchInput) {
        const url = 'http://localhost:8081/registros/buscar'; 
        const bodyData = {};
        bodyData[searchOption] = searchInput;

        document.getElementById('registroList').innerHTML = '';
        document.getElementById('userList').style.display = 'none';
        document.getElementById('userDetails').style.display = 'none';

        realizarBusqueda(url, bodyData)
            .then(data => {
                if (!data || data.length === 0) {
                    throw new Error('No se encontraron registros.');
                }
                mostrarListaUsuarios(data);
                searchInput.value = ''; 
            })
            .catch(error => {
                mostrarModalError(error.message);
            });
    }

    // ✅ Realizar la búsqueda con fetch
    function realizarBusqueda(url, bodyData) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }).then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor.');
            return response.json();
        });
    }

    // ✅ Mostrar lista de usuarios encontrados
    function mostrarListaUsuarios(data) {
        const registroList = document.getElementById('registroList');
        registroList.innerHTML = '';

        document.getElementById('userList').style.display = 'block';
        document.getElementById('userDetails').style.display = 'none';

        data.forEach(registro => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            listItem.innerHTML = `
                <span><strong>Nombre:</strong> ${registro.nombre || 'No disponible'}</span>
                <button class="btn btn-sm btn-info ver-detalles-btn">Ver Detalles</button>
            `;

            listItem.querySelector('.ver-detalles-btn').addEventListener('click', () => {
                mostrarDetallesUsuario(registro);
            });

            registroList.appendChild(listItem);
        });
    }

    // ✅ Mostrar detalles completos del usuario
    function mostrarDetallesUsuario(data) {
        document.getElementById('userDetails').style.display = 'block';
        document.getElementById('nombre').textContent = data.nombre || 'No disponible';
        document.getElementById('correo').textContent = data.correo || 'No disponible';
        document.getElementById('telefono').textContent = data.telefono || 'No disponible';
        document.getElementById('direccion').textContent = data.direccion || 'No disponible';
        document.getElementById('rfc').textContent = data.rfc || 'No disponible';
        document.getElementById('curp').textContent = data.curp || 'No disponible';
        document.getElementById('pais').textContent = data.pais || 'No disponible';
        document.getElementById('estado').textContent = data.estado || 'No disponible';
        document.getElementById('fechaRegistro').textContent = data.fechaRegistro || 'No disponible';
        document.getElementById('username').textContent = data.username || 'No disponible';
        document.getElementById('rolNombre').textContent = data.rol || 'No disponible';

        // 🎨 Mostrar Estado Activo/Inactivo con Badge
        const activoBadge = document.getElementById('activo');
        if (data.activo) {
            activoBadge.innerHTML = '<span class="badge badge-success">Activo ✔️</span>';
        } else {
            activoBadge.innerHTML = '<span class="badge badge-danger">Inactivo ❌</span>';
        }

        // Botones para editar/eliminar
        document.getElementById('updateButton').onclick = () => {
            sessionStorage.setItem('usuarioParaEditar', JSON.stringify(data));
            window.location.href = '/Registro/editarRegistro.html';
        };

        document.getElementById('deleteButton').onclick = () => {
            sessionStorage.setItem('usuarioParaEliminar', JSON.stringify(data));
            window.location.href = '/Registro/eliminarRegistro.html';
        };
    }

    // ✅ Mostrar modal de error
    function mostrarModalError(message) {
        document.getElementById('modalErrorMessage').textContent = message || 'Ocurrió un error al realizar la búsqueda.';
        $('#errorModal').modal('show');
    }
});
