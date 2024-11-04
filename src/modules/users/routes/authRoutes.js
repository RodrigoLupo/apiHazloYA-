const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para login
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/login-admins', authController.loginAdminOrEncargado);
module.exports = router;
