const mysql = require('mysql2');

// Configuración de conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Da1mery',
    database: 'PV',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

module.exports = connection;
