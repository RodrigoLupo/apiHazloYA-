const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');
const { verifyToken , isEncargadoOrAdmin} = require('../../../middleware/authMiddleware');
// Configuración de multer para guardar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Ruta para subir documentos PDF
router.post('/upload', upload.single('documento'), verifyToken, documentController.uploadDocument);
router.get('/user-documents/:id', verifyToken, isEncargadoOrAdmin,documentController.getUserWithDocuments);
router.get('/user-documents', verifyToken, isEncargadoOrAdmin,documentController.getAllUsersWithDocuments);

module.exports = router;
