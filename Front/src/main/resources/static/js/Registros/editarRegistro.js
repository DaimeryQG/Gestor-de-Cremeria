// Al cargar la página, obtenemos el usuario de sessionStorage y lo mostramos en el formulario
window.onload = function() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioParaEditar'));  // Recupera el usuario de sessionStorage
    
    if (usuario) {
        // Rellenamos el formulario con los datos existentes
        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('correo').value = usuario.correo || '';
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('direccion').value = usuario.direccion || '';
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
};

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const usuario = JSON.parse(sessionStorage.getItem('usuarioParaEditar'));  // Recupera el usuario de sessionStorage

    const updatedData = {
        id: usuario.id,  // Asegúrate de enviar la id
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        rfc: document.getElementById('rfc').value,
        curp: document.getElementById('curp').value,
        pais: document.getElementById('pais').value,
        estado: document.getElementById('estado').value,
        fechaRegistro: usuario.fechaRegistro,  // Asumiendo que no deseas modificar esta propiedad
        username: usuario.username,  // Asumiendo que no deseas modificar esta propiedad
        rolNombre: usuario.rolNombre  // Asumiendo que no deseas modificar esta propiedad
    };

    // Enviar la actualización al backend
    fetch(`http://localhost:8081/registros/${usuario.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el registro');
        }
        return response.json();
    })
    .then(data => {
        alert('Registro actualizado con éxito');
        // Redirige o haz algo con la respuesta
        window.location.href = '/Registro/buscarRegistro.html';  // Redirige a una página de lista o donde desees
    })
    .catch(error => {
        console.error(error);
        alert('Ocurrió un error al actualizar el registro');
    });
});