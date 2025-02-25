document.addEventListener("DOMContentLoaded", function () {
    const createForm = document.getElementById("createForm");

    createForm.addEventListener("submit", function (e) {
        e.preventDefault();

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

        if (!nombre || !correo || !fechaRegistro || !username || !password) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

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

        fetch("http://localhost:8081/registros/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registro)
        })
        .then(response => {
            if (response.ok) {
                $('#successModal').modal('show');
                createForm.reset();
                document.getElementById("goHomeButton").addEventListener("click", function () {
                    window.location.href = '/Registro/buscarRegistro.html';
                });
            } else if (response.status === 409) {
                response.text().then(message => mostrarModalError(message));
            } else {
                throw new Error("Error al crear el registro");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarModalError("Hubo un problema al crear el registro.");
        });
    });
});

function mostrarModalError(message) {
    document.getElementById('modalErrorMessage').textContent = message || 'Ocurrió un error al realizar la operación.';
    $('#errorModal').modal('show');
}
