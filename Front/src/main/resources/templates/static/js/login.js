document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
  
    fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.statusCode === 200) {
        alert("Inicio de sesión correcto");
        window.location.href = "dashboard.html"; // Redirige a la página de destino
      } else {
        document.getElementById('error-message').style.display = 'block';
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  });
  