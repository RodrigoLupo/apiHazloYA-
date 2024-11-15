const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { verifyToken, isEncargadoOrAdmin, isAdmin } = require('../../../middleware/authMiddleware');

router.post('/register', userController.registerUser); // Ruta para registrar un usuario
router.put('/activate/:id', verifyToken,isEncargadoOrAdmin,userController.activateUser); // Ruta para activar un usuario
router.get('/activados/:page', verifyToken, isEncargadoOrAdmin, userController.getActiveUsers); // Ruta para obtener los usuarios activados
router.get('/desactivados/:page',verifyToken, isEncargadoOrAdmin , userController.getInactiveUsers); // Ruta para obtener los usuarios desactivados
router.put('/deactivate/:id', verifyToken,isEncargadoOrAdmin,userController.deactivateUser); // Ruta para desactivar un usuario
router.post('/create-encargado', verifyToken, isEncargadoOrAdmin, userController.createEncargadoOrAdmin); // Ruta para crear un encargado o admin
router.delete('/rechazar/:id', verifyToken, isAdmin, userController.deleteUser); // Ruta para rechazar un usuario
router.get('/miestado', verifyToken, userController.EstadoUsuario); // Ruta para obtener el estado del usuario
router.get('/reporte', verifyToken, isAdmin,userController.getReport); // Ruta para obtener el reporte de usuarios y trabajos publicados
module.exports = router;