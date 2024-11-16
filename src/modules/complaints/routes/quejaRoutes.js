const express = require('express');
const router = express.Router();
const quejaController = require('../controllers/controllerQuejas');
const authMiddleware = require('../../../middleware/authMiddleware');

router.post('/crear/:tipo', authMiddleware.verifyToken, quejaController.createQueja);
router.get('/all', authMiddleware.verifyToken, authMiddleware.isEncargadoOrAdmin,quejaController.getAllQuejas); 
module.exports = router;
