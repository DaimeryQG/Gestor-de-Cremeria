window.onload = function () {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioParaEliminar')); // Recupera el usuario desde sessionStorage

    if (usuario) {
        // Rellenamos el formulario con los datos existentes
        document.getElementById('nombre').value = usuario.nombre || 'No disponible';
        document.getElementById('correo').value = usuario.correo || 'No disponible';
        document.getElementById('telefono').value = usuario.telefono || 'No disponible';
        document.getElementById('direccion').value = usuario.direccion || 'No disponible';
        document.getElementById('rfc').value = usuario.rfc || 'No disponible';
        document.getElementById('curp').value = usuario.curp || 'No disponible';
        document.getElementById('pais').value = usuario.pais || 'No disponible';
        document.getElementById('estado').value = usuario.estado || 'No disponible';
        document.getElementById('fechaRegistro').value = usuario.fechaRegistro || 'No disponible';
        document.getElementById('username').value = usuario.username || 'No disponible';
        document.getElementById('rolNombre').value = usuario.rolNombre || 'No disponible';

        // Manejar Activar
        document.getElementById('activarButton').onclick = function () {
            fetch(`http://localhost:8081/registros/activar/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(data.mensaje || 'Usuario activado con éxito.');
                actualizarBotones(true); // Actualiza estado de los botones
            })
            .catch(error => {
                mostrarMensaje(error.message || 'Ocurrió un error al activar el usuario');
            });
        };

        // Manejar Desactivar
        document.getElementById('desactivarButton').onclick = function () {
            fetch(`http://localhost:8081/registros/desactivar/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(data.mensaje || 'Usuario desactivado con éxito.');
                actualizarBotones(false); // Actualiza estado de los botones
            })
            .catch(error => {
                mostrarMensaje(error.message || 'Ocurrió un error al desactivar el usuario');
            });
        };

        // Configurar la acción del botón de eliminación
        document.getElementById('deleteButton').onclick = function () {
            $('#deleteModal').modal('show');
        };

        // Confirmar eliminación en el modal
        document.getElementById('confirmDeleteButton').onclick = function () {
            fetch(`http://localhost:8081/registros/${usuario.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(data.mensaje || 'Usuario eliminado con éxito.');
                setTimeout(() => {
                    window.location.href = '/Registro/buscarRegistro.html';
                }, 2000);
            })
            .catch(error => {
                mostrarMensaje(error.message || 'Ocurrió un error al eliminar el registro');
            });
            $('#deleteModal').modal('hide');
        };

        // Inicializar botones según el estado del usuario
        actualizarBotones(usuario.activo);

    } else {
        mostrarMensaje("No se encontró el usuario en sesión.");
    }

    // Función para actualizar los botones según el estado
    function actualizarBotones(isActive) {
        const activarButton = document.getElementById('activarButton');
        const desactivarButton = document.getElementById('desactivarButton');

        if (isActive) {
            activarButton.classList.add('btn-success');
            activarButton.classList.remove('btn-outline-success');
            desactivarButton.classList.add('btn-outline-secondary');
            desactivarButton.classList.remove('btn-secondary');
        } else {
            activarButton.classList.add('btn-outline-success');
            activarButton.classList.remove('btn-success');
            desactivarButton.classList.add('btn-secondary');
            desactivarButton.classList.remove('btn-outline-secondary');
        }
    }

    // Función para mostrar mensajes en el modal
    function mostrarMensaje(mensaje) {
        document.getElementById('messageModalBody').textContent = mensaje;
        $('#messageModal').modal('show');
    }
};