document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const searchOption = document.getElementById('searchOption').value;  // Obtener el tipo de búsqueda seleccionado
    const searchInput = document.getElementById('searchInput').value.trim();  // Obtener el valor de búsqueda

    if (!searchInput) {
        alert('Por favor, ingrese un término de búsqueda válido.');
        return;
    }

    // Llamar a la función para buscar el registro con el parámetro adecuado
    buscarRegistro(searchOption, searchInput);
});

// Crear
document.getElementById('createButton').addEventListener('click', function() {
    window.location.href = '/Registro/crearRegistro.html'; // Redirige a la página de registro
});


function buscarRegistro(searchOption, searchInput) {
    let url = ''; 
    let bodyData = {};

    // Dependiendo de la opción seleccionada, se arma la URL y los datos
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

    realizarBusqueda(url, bodyData)
        .then(data => {
            if (!data || Object.keys(data).length === 0) {
                throw new Error('No se encontró el registro.');
            }
            mostrarDetallesUsuario(data);
            document.getElementById('searchInput').value = '';  // Limpiar el valor del campo de búsqueda
        })
        .catch(error => {
            mostrarModalError(error.message);  // Mostrar el modal de error
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

function mostrarDetallesUsuario(data) {
    // Asegurarse de que los datos del usuario se muestren en el formato adecuado
    console.log(data);
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
    document.getElementById('rolNombre').textContent = data.rolNombre|| 'No disponible';

    // Configura el evento del botón "Actualizar"
    document.getElementById('updateButton').onclick = () => {
        // Guarda los datos en sessionStorage
        sessionStorage.setItem('usuarioParaEditar', JSON.stringify(data));

        // Redirige a la página de edición
        window.location.href = '/Registro/editarRegistro.html';
    };

    // Configura el evento del botón "Eliminar"
    document.getElementById('deleteButton').onclick = () => {
        // Guarda los datos en sessionStorage
        sessionStorage.setItem('usuarioParaEliminar', JSON.stringify(data));

        // Redirige a la página de edición
        window.location.href = '/Registro/eliminarRegistro.html';
    };
}

function mostrarModalError(message) {
    // Mostrar el modal de error con el mensaje
    document.getElementById('modalErrorMessage').textContent = message || 'Ocurrió un error al realizar la búsqueda.';
    $('#errorModal').modal('show');
}
