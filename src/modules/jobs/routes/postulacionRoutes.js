const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');

router.post('/create', postulacionController.createPostulacion);

module.exports = router;