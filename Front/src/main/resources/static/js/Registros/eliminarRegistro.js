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
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al activar el usuario');
                    }
                    return response.text();
                })
                .then(message => {
                    alert(message);
                    actualizarBotones(true); // Actualiza estado de los botones
                })
                .catch(error => {
                    console.error(error);
                    alert('Ocurrió un error al activar el usuario');
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
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al desactivar el usuario');
                    }
                    return response.text();
                })
                .then(message => {
                    alert(message);
                    actualizarBotones(false); // Actualiza estado de los botones
                })
                .catch(error => {
                    console.error(error);
                    alert('Ocurrió un error al desactivar el usuario');
                });
        };

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

        // Inicializar botones según el estado del usuario
        actualizarBotones(usuario.activo);

    } else {
        alert("No se encontró el usuario en sesión.");
    }

    // Configurar la acción del botón de eliminación
    document.getElementById('deleteButton').onclick = function () {
        $('#deleteModal').modal('show');
    };

    // Confirmar eliminación en el modal
    document.getElementById('confirmDeleteButton').onclick = function () {
        if (usuario) {
            fetch(`http://localhost:8081/registros/${usuario.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el registro');
                    }
                    alert('Usuario eliminado con éxito');
                    window.location.href = '/Registro/buscarRegistro.html';
                })
                .catch(error => {
                    console.error(error);
                    alert('Ocurrió un error al eliminar el registro');
                });
            $('#deleteModal').modal('hide');
        }
    };
};
