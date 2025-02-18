window.onload = function() {
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
    } else {
        alert("No se encontró el usuario en sesión.");
    }

    // Configurar la acción del botón de eliminación
    document.getElementById('deleteButton').onclick = function() {
        // Mostrar el modal de confirmación
        $('#deleteModal').modal('show');
    };

    // Confirmar eliminación en el modal
    document.getElementById('confirmDeleteButton').onclick = function() {
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
                window.location.href = '/Registro/buscarRegistro.html';  // Redirige a la lista de usuarios
            })
            .catch(error => {
                console.error(error);
                alert('Ocurrió un error al eliminar el registro');
            });
            // Cerrar el modal
            $('#deleteModal').modal('hide');
        }
    };
};
