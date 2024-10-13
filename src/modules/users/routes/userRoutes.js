const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');


router.post('/register', userController.registerUser);
router.put('/activate/:id', userController.activateUser);
router.post('/login', authController.login);

module.exports = router;

