const express = require('express');
const app = express();
const port = 3000; // Asegúrate de que este es el puerto correcto

// Ruta para la página principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi aplicación!');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
