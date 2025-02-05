const db = require('../config/db');

// Modelo de producto
const Producto = {
    getAll: (callback) => {
        db.query('SELECT * FROM productos', (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    // Otros métodos como insertar, actualizar, eliminar productos...
};

module.exports = Producto;
