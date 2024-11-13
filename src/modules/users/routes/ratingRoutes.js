const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken, isContratista } = require('../../../middleware/authMiddleware');

router.post('/rate', verifyToken, isContratista,ratingController.rateCollaborator);

module.exports = router;
