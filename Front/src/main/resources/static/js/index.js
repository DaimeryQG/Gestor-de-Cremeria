document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar que el formulario se envíe

  const usuario = document.getElementById('usuario');
  const password = document.getElementById('password');
  const emptyFieldsMessage = document.getElementById('empty-fields-message');

  // Reiniciar el estado de los campos y los mensajes de error
  usuario.classList.remove('is-invalid');
  password.classList.remove('is-invalid');
  emptyFieldsMessage.style.display = 'none';

  // Validar si los campos están vacíos
  if (usuario.value.trim() === '' || password.value.trim() === '') {
    if (usuario.value.trim() === '') {
      usuario.classList.add('is-invalid');
    }
    if (password.value.trim() === '') {
      password.classList.add('is-invalid');
    }
    emptyFieldsMessage.style.display = 'block'; // Mostrar el mensaje
    return; // Detener el envío si los campos están vacíos
  }

  // Si los campos están completos, hacer la solicitud de inicio de sesión
  fetch('http://localhost:8081/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usuario.value,
      password: password.value,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.statusCode === 200) {
      // Mostrar el mensaje de éxito (Modal)
      const myModal = new bootstrap.Modal(document.getElementById('success-message'));
      myModal.show();
      
      // Redirigir después de un tiempo (2 segundos)
      setTimeout(() => {
        window.location.href = "/bienvenido/inicio.html";
 // Redirige a la página de destino
      }, 2000); // Espera 2 segundos antes de redirigir
    } else {
      document.getElementById('error-message').style.display = 'block';
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
});

document.getElementById('clearButton').addEventListener('click', function() {
  document.getElementById('usuario').value = '';
  document.getElementById('password').value = '';
  document.getElementById('empty-fields-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
});
