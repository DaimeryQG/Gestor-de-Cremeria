document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita el envío por defecto

  const usuario = document.getElementById('usuario');
  const password = document.getElementById('password');
  const emptyFieldsMessage = document.getElementById('empty-fields-message');
  const errorMessage = document.getElementById('error-message');
  const successModalElement = document.getElementById('success-message');
  const successModal = new bootstrap.Modal(successModalElement);

  // Limpiar mensajes previos
  usuario.classList.remove('is-invalid');
  password.classList.remove('is-invalid');
  emptyFieldsMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  // Validar campos vacíos
  if (!usuario.value.trim() || !password.value.trim()) {
    if (!usuario.value.trim()) usuario.classList.add('is-invalid');
    if (!password.value.trim()) password.classList.add('is-invalid');
    emptyFieldsMessage.style.display = 'block';
    return;
  }

  // Simulación de autenticación
  fetch('http://localhost:8081/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usuario.value.trim(),
      password: password.value.trim(),
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.statusCode === 200) {
      successModal.show();

      // Cerrar el modal después de 2 segundos y redirigir
      setTimeout(() => {
        successModal.hide();
        window.location.href = '/bienvenido/inicio.html';
      }, 2000);
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = data.message || 'Usuario o contraseña incorrectos.';
    }
  })
  .catch(error => {
    console.error("Error al iniciar sesión:", error);
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Error al conectar con el servidor.';
  });
});

// Botón para limpiar el formulario
document.getElementById('clearButton').addEventListener('click', function() {
  document.getElementById('usuario').value = '';
  document.getElementById('password').value = '';
  document.getElementById('empty-fields-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
});
