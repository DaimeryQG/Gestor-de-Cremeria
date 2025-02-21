// Al cargar la página
window.onload = function() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioParaEditar'));

    if (usuario) {
        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('correo').value = usuario.correo || '';
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('direccion').value = usuario.direccion || '';
        document.getElementById('rfc').value = usuario.rfc || '';
        document.getElementById('curp').value = usuario.curp || '';
        document.getElementById('pais').value = usuario.pais || '';
        document.getElementById('estado').value = usuario.estado || '';
        document.getElementById('fechaRegistro').value = usuario.fechaRegistro || '';
        document.getElementById('username').value = usuario.username || '';
        document.getElementById('password').value = '';

        if (usuario.rol && usuario.rol.id) {
            document.getElementById('rolNombre').value = usuario.rol.id;
        }

        // Mostrar "****" si la contraseña está vacía
        const passwordField = document.getElementById('password');
        if (!usuario.password) {
            passwordField.placeholder = '****';
        }
    } else {
        alert("No se encontró el usuario en sesión.");
    }

    // Lógica para el campo de contraseña
    const passwordField = document.getElementById('password');

    passwordField.addEventListener('focus', function() {
        if (passwordField.placeholder === '****') {
            passwordField.placeholder = '';
        }
    });

    passwordField.addEventListener('blur', function() {
        if (passwordField.value.trim() === '') {
            passwordField.placeholder = '****';
        }
    });
};

// Manejo del formulario
document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const usuario = JSON.parse(sessionStorage.getItem('usuarioParaEditar'));
    const password = document.getElementById('password').value.trim();

    // Validación del campo de contraseña
    if (password === '') {
        $('#errorModal .modal-body').text("El campo de contraseña no puede estar vacío.");
        $('#errorModal').modal('show');
        return;
    }

    const updatedData = {
        id: usuario.id,
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        rfc: document.getElementById('rfc').value,
        curp: document.getElementById('curp').value,
        pais: document.getElementById('pais').value,
        estado: document.getElementById('estado').value,
        fechaRegistro: usuario.fechaRegistro,
        username: usuario.username,
        password: password,
        rol: { id: parseInt(document.getElementById('rolNombre').value) }
    };

    // Enviar datos al backend
    fetch(`http://localhost:8081/registros/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status >= 400) {
            throw new Error(body.error || 'Error al actualizar el registro.');
        }

        $('#successModal .modal-body').text(body.mensaje || 'Registro actualizado correctamente.');
        $('#successModal').modal('show');

        $('#successModal').on('hidden.bs.modal', function () {
            window.location.href = '/Registro/buscarRegistro.html';
        });

        setTimeout(() => {
            $('#successModal').modal('hide');
        }, 2000);
    })
    .catch(error => {
        $('#errorModal .modal-body').text(error.message || 'Ocurrió un error al actualizar.');
        $('#errorModal').modal('show');
    });
});