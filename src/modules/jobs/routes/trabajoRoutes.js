const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const {verifyToken, isColaborador, isContratista, isEncargadoOrAdmin} = require('../../../middleware/authMiddleware');
router.post('/create',verifyToken, isContratista,trabajoController.createTrabajo); // Ruta para crear un trabajo solo para contratistas
router.get('/obtener/:id', verifyToken, isContratista, trabajoController.getTrabajoById); // Ruta para obtener un trabajo por id
router.get('/cercanos/:page',verifyToken, isColaborador, trabajoController.listTrabajosCercanos); // Ruta para listar trabajos cercanos al colaborador -> puedes usar getTrabajosByTitleAndLocation
router.get('/ultimos/:page', verifyToken, isContratista, trabajoController.listUltimosTrabajosByContratista); // Ruta para listar los últimos trabajos creados por un contratista estado 'Abierto'
router.get('/buscar', verifyToken,isColaborador, trabajoController.getTrabajosByTitleAndLocation); // Ruta para buscar trabajos por título y ubicación (ciudad y distrito del colaborador)
router.patch('/aceptar/:postulacionId', verifyToken, isContratista, trabajoController.aceptarSolicitud); // Ruta para aceptar una postulación
router.get('/aceptado/:trabajoId/colaborador',verifyToken, isContratista, trabajoController.getColaboradorByTrabajoId); // Ruta para obtener el colaborador aceptado por un trabajo
router.get('/historial', verifyToken, isContratista,trabajoController.getHistorialTrabajos); // Ruta para obtener el historial de trabajos de un contratista
router.get('/all', verifyToken, isEncargadoOrAdmin, trabajoController.getAllTrabajos); // Ruta para obtener todos los trabajos
module.exports = router;