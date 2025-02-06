  // Seleccionar el formulario
  const loginForm = document.getElementById("loginForm");

  // Manejar el evento de envío del formulario
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario realice una acción por defecto
    window.location.href = "./view/inicio.html"; // Redirige a inicio.html
  });
