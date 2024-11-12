const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');
const {verifyToken} = require('../../../middleware/authMiddleware');
router.post('/create', verifyToken, postulacionController.createPostulacion);
router.get('/trabajo/:trabajoId/postulantes', verifyToken, postulacionController.listPostulantesByTrabajo);

module.exports = router;