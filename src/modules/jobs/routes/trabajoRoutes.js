const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const {verifyToken, isColaborador, isContratista} = require('../../../middleware/authMiddleware');
router.post('/create',verifyToken, isContratista,trabajoController.createTrabajo);
router.get('/:id', isContratista, trabajoController.getTrabajoById); 
router.get('/cercanos/:page',verifyToken, isColaborador, trabajoController.listTrabajosCercanos);
router.get('/ultimos/:page', verifyToken,isContratista, trabajoController.listUltimosTrabajosByContratista);
module.exports = router;