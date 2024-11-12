const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const {verifyToken} = require('../../../middleware/authMiddleware');
router.post('/create', verifyToken,trabajoController.createTrabajo);
router.get('/:id', trabajoController.getTrabajoById); 
router.get('/cercanos/:page', verifyToken, trabajoController.listTrabajosCercanos);

module.exports = router;