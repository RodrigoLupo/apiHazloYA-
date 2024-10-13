const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');

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
router.post('/upload/:id', upload.single('documento'), documentController.uploadDocument);

module.exports = router;
