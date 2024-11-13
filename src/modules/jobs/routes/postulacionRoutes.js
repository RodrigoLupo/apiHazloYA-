const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');
const {verifyToken, isColaborador, isContratista} = require('../../../middleware/authMiddleware');
router.post('/create',verifyToken, isColaborador, postulacionController.createPostulacion);
router.get('/trabajo/:trabajoId/postulantes',verifyToken, isContratista, postulacionController.listPostulantesByTrabajo);
router.get('/historial', verifyToken, isColaborador, postulacionController.getHistorialPostulaciones);

module.exports = router;