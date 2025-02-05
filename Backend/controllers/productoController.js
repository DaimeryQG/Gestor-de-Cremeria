const Producto = require('../models/productoModel');

// Función para obtener todos los productos
exports.getProductos = (req, res) => {
    Producto.getAll((err, productos) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.json(productos);
    });
};
