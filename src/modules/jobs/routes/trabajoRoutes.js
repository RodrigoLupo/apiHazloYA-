const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');

router.post('/create', trabajoController.createTrabajo);
router.get('/:id', trabajoController.getTrabajoById); 

module.exports = router;