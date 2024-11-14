const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para login
router.post('/login', authController.login); // Ruta para iniciar sesión
router.post('/logout', authController.logout); // Ruta para cerrar sesión
router.post('/login-admins', authController.loginAdminOrEncargado); // Ruta para iniciar sesión como administrador o encargado
module.exports = router;
