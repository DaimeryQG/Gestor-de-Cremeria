const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Ruta para obtener productos
router.get('/', productoController.getProductos);

// Más rutas para crear, editar y eliminar productos...

module.exports = router;
