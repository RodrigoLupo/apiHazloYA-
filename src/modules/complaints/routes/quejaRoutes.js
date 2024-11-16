const express = require('express');
const router = express.Router();
const quejaController = require('../controllers/controllerQuejas');
const authMiddleware = require('../../../middleware/authMiddleware');

router.post('/crear/:tipo', authMiddleware.verifyToken, quejaController.createQueja);
router.get('/all', authMiddleware.verifyToken, authMiddleware.isEncargadoOrAdmin,quejaController.getAllQuejas);
router.patch('/actualizar/:id', quejaController.updateQuejaEstado)// Ruta para actualizar el estado de una queja;
module.exports = router;
