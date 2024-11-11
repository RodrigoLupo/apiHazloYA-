const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { verifyToken, isEncargadoOrAdmin } = require('../../../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.put('/activate/:id', verifyToken,isEncargadoOrAdmin,userController.activateUser);
router.get('/activados/:page', verifyToken, isEncargadoOrAdmin, userController.getActiveUsers);
router.get('/desactivados/:page', verifyToken, isEncargadoOrAdmin, userController.getInactiveUsers);
router.put('/deactivate/:id', verifyToken,isEncargadoOrAdmin,userController.deactivateUser);
router.post('/create-encargado', verifyToken, isEncargadoOrAdmin, userController.createEncargadoOrAdmin);
router.delete('/rechazar/:id', verifyToken, isEncargadoOrAdmin, userController.deleteUser);
module.exports = router;