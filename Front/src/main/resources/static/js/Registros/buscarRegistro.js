document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const searchOption = document.getElementById('searchOption').value;  // Obtener el tipo de búsqueda seleccionado
    const searchInput = document.getElementById('searchInput').value.trim();  // Obtener el valor de búsqueda

    if (!searchInput) {
        alert('Por favor, ingrese un término de búsqueda válido.');
        return;
    }

    buscarRegistro(searchOption, searchInput);
});

// Crear
document.getElementById('createButton').addEventListener('click', function() {
    window.location.href = '/Registro/crearRegistro.html'; // Redirige a la página de registro
});

function buscarRegistro(searchOption, searchInput) {
    let url = ''; 
    let bodyData = {};

    if (searchOption === 'nombre') {
        url = 'http://localhost:8081/registros/buscarPorNombre';
        bodyData = { nombre: searchInput };
    } else if (searchOption === 'rfc') {
        url = 'http://localhost:8081/registros/buscarPorRfc';
        bodyData = { rfc: searchInput };
    } else if (searchOption === 'curp') {
        url = 'http://localhost:8081/registros/buscarPorCurp';
        bodyData = { curp: searchInput };
    }

    // Limpiar resultados anteriores
    document.getElementById('registroList').innerHTML = '';
    document.getElementById('userList').style.display = 'none'; // Ocultar la lista de usuarios
    document.getElementById('userDetails').style.display = 'none'; // Ocultar detalles del usuario
    
    realizarBusqueda(url, bodyData)
        .then(data => {
            if (!data || data.length === 0) {
                throw new Error('No se encontró el registro.');
            }
            mostrarListaUsuarios(data);
            document.getElementById('searchInput').value = '';  // Limpiar el campo de búsqueda
        })
        .catch(error => {
            mostrarModalError(error.message);
        });
}

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

function mostrarListaUsuarios(data) {
    // Limpiar la lista previa si la hay
    const registroList = document.getElementById('registroList');
    registroList.innerHTML = '';

    // Mostrar la sección de lista
    document.getElementById('userList').style.display = 'block';
    document.getElementById('userDetails').style.display = 'none'; // Ocultar detalles previos si están abiertos

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
    document.getElementById('rolNombre').textContent = data.rolNombre || 'No disponible';

    document.getElementById('updateButton').onclick = () => {
        sessionStorage.setItem('usuarioParaEditar', JSON.stringify(data));
        window.location.href = '/Registro/editarRegistro.html';
    };

    document.getElementById('deleteButton').onclick = () => {
        sessionStorage.setItem('usuarioParaEliminar', JSON.stringify(data));
        window.location.href = '/Registro/eliminarRegistro.html';
    };
}

function mostrarModalError(message) {
    document.getElementById('modalErrorMessage').textContent = message || 'Ocurrió un error al realizar la búsqueda.';
    $('#errorModal').modal('show');
}
