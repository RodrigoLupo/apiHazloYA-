const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');
const {verifyToken, isColaborador, isContratista} = require('../../../middleware/authMiddleware');
router.post('/create',verifyToken, isColaborador, postulacionController.createPostulacion); // Ruta para postular a un trabajo solo para colaboradores
router.get('/trabajo/:trabajoId/postulantes',verifyToken, isContratista, postulacionController.listPostulantesByTrabajo); // Ruta para listar los postulantes de un trabajo solo para contratistas
router.get('/historial', verifyToken, isColaborador, postulacionController.getHistorialPostulaciones); // Ruta para obtener el historial de postulaciones de un colaborador por estado (Aceptado, Rechazado, Pendiente)

module.exports = router;