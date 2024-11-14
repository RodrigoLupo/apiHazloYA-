const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const {verifyToken, isColaborador, isContratista} = require('../../../middleware/authMiddleware');
router.post('/create',verifyToken, isContratista,trabajoController.createTrabajo); // Ruta para crear un trabajo solo para contratistas
router.get('/obtener/:id', verifyToken, isContratista, trabajoController.getTrabajoById); // Ruta para obtener un trabajo por id
router.get('/cercanos/:page',verifyToken, isColaborador, trabajoController.listTrabajosCercanos); // Ruta para listar trabajos cercanos al colaborador -> puedes usar getTrabajosByTitleAndLocation
router.get('/ultimos/:page', verifyToken, isContratista, trabajoController.listUltimosTrabajosByContratista); // Ruta para listar los últimos trabajos creados por un contratista estado 'Abierto'
router.get('/buscar', verifyToken,isColaborador, trabajoController.getTrabajosByTitleAndLocation); // Ruta para buscar trabajos por título y ubicación (ciudad y distrito del colaborador)
module.exports = router;