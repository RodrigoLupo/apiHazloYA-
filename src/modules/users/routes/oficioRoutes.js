// routes/oficioRoutes.js
const express = require('express');
const oficioController = require('../controllers/oficioController');
const authMiddleware = require('../../../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware.verifyToken, authMiddleware.isAdmin, oficioController.createOficio); // Ruta para crear un oficio
router.put('/:oficioId/add-colaborador', authMiddleware.verifyToken, authMiddleware.isColaborador, oficioController.addColaboradorToOficio); // Ruta para añadir un colaborador a un oficio
router.get('/:nombre/colaboradores', authMiddleware.verifyToken, oficioController.getColaboradoresByOficioAndLocation); // Ruta para obtener los colaboradores por oficio y ubicación
router.put('/:oficioId/edit', authMiddleware.verifyToken, authMiddleware.isEncargadoOrAdmin,oficioController.editOficio); // Ruta para editar un oficio
router.delete('/:oficioId', authMiddleware.verifyToken, authMiddleware.isAdmin,oficioController.deleteOficio); // Ruta para eliminar un oficio
router.get('/count', authMiddleware.verifyToken, authMiddleware.isEncargadoOrAdmin,oficioController.countColaboradoresPorOficio); // Ruta para contar los colaboradores de todos los oficios -> posible grafico en la interfaz
router.get('/all', authMiddleware.verifyToken,oficioController.getTodosOficios); // Ruta para obtener todos los oficios
router.get('/check', authMiddleware.verifyToken, authMiddleware.isColaborador,oficioController.checkearOficios); // Ruta para verificar si un colaborador está en un oficio
module.exports = router;
