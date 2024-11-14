// routes/oficioRoutes.js
const express = require('express');
const oficioController = require('../controllers/oficioController');
const authMiddleware = require('../../../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware.verifyToken, authMiddleware.isAdmin, oficioController.createOficio);
router.put('/:oficioId/add-colaborador', authMiddleware.verifyToken, authMiddleware.isColaborador, oficioController.addColaboradorToOficio);
router.get('/:nombre/colaboradores', authMiddleware.verifyToken, oficioController.getColaboradoresByOficioAndLocation);
router.put('/:oficioId/edit', authMiddleware.verifyToken, oficioController.editOficio);
router.delete('/:oficioId', authMiddleware.verifyToken, oficioController.deleteOficio);
router.get('/:nombre/count', authMiddleware.verifyToken, oficioController.countColaboradoresPorOficio);

module.exports = router;
