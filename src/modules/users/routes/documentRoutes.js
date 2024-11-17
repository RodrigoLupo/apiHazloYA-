const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');
const { verifyToken , isEncargadoOrAdmin, isAdmin} = require('../../../middleware/authMiddleware');
const storage = multer.memoryStorage(); // Para manejo en buffer
const upload = multer({ storage });

// Ruta para subir documentos PDF
router.post('/upload', upload.single('documento'), verifyToken, documentController.uploadDocument); // Ruta para subir un documento PDF
router.get('/stream', documentController.streamDocument); // Ruta para transmitir un archivo
router.post('/documents/signed-url', verifyToken, isEncargadoOrAdmin, documentController.generateSignedUrl); // Ruta para generar una URL firmada
router.get('/user-documents/:id', verifyToken, isEncargadoOrAdmin,documentController.getUserWithDocuments); // Ruta para obtener un usuario con sus documentos
router.get('/user-documents', verifyToken, isEncargadoOrAdmin,documentController.getAllUsersWithDocuments); // Ruta para obtener todos los usuarios con sus documentos

module.exports = router;
