document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar el formulario
    const createForm = document.getElementById("createForm");

    // Manejar el evento de envío del formulario
    createForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const direccion = document.getElementById("direccion").value;
        const rfc = document.getElementById("rfc").value;
        const curp = document.getElementById("curp").value;
        const pais = document.getElementById("pais").value;
        const estado = document.getElementById("estado").value;
        const fechaRegistro = document.getElementById("fechaRegistro").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const rol = { id: parseInt(document.getElementById("rol").value) };

        // Validar campos requeridos
        if (!nombre || !correo || !fechaRegistro || !username || !password) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        // Crear un objeto con los datos del formulario
        const registro = {
            nombre,
            correo,
            telefono,
            direccion,
            rfc,
            curp,
            pais,
            estado,
            fechaRegistro,
            username,
            password,
            rol
        };

        // Enviar una solicitud POST al backend para crear el registro
        fetch("http://localhost:8081/registros/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registro)
        })
        .then(response => {
            if (response.ok) {
                $('#successModal').modal('show'); 
                createForm.reset(); // Limpiar el formulario después de crear el registro
                document.getElementById("goHomeButton").addEventListener("click", function() {
                    window.location.href = '/Registro/buscarRegistro.html'; // Redirigir a la página principal
                });
            } else {
                throw new Error("Error al crear el registro");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            $('#errorModal').modal('show');
        });
    });
});