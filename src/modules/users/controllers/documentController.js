const documentService = require('../services/documentService');
const Document = require('../models/Document');
const jwt = require('jsonwebtoken');

exports.uploadDocument2 = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo no proporcionado.' });
    }

    const { tipo_documento } = req.body;
    const filePath = req.file.path; // La ruta donde se guarda el archivo
    const usuarioId = req.userId;

    const documento = await documentService.saveDocument(usuarioId, tipo_documento, filePath);
    res.status(201).json({ message: 'Documento subido correctamente', documento });
  } catch (error) {
    console.error('Error en uploadDocument:', error);
    res.status(400).json({ error: error.message });
  }
};
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo no proporcionado.' });
    }

    const { tipo_documento } = req.body;
    const usuarioId = req.userId;
    const key = `${tipo_documento}/${Date.now()}_${req.file.originalname}`;

    const rutaArchivo = await documentService.uploadFile(req.file, key);

    const newDocument = new Document({
      usuario_id: usuarioId,
      tipo_documento,
      estado: 'pendiente',
      nombre_key: key,
      ruta_archivo: rutaArchivo,
    });

    await newDocument.save();
    res.status(201).json({ message: 'Documento subido correctamente', documento: newDocument });
  } catch (error) {
    console.error('Error al subir documento:', error);
    res.status(500).json({ error: 'Error al subir documento' });
  }
};

exports.generateSignedUrl = async (req, res) => {
  const { key } = req.query; // o req.query según tu preferencia
  const userId = req.userId;
  const token = jwt.sign(
    { key, userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } 
  );
  const signedUrl = `${process.env.BASE_URL}/api/documents/stream?token=${token}`;
  res.json({ signedUrl });
};

exports.streamDocument = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { key } = decoded;
    const fileStream = await documentService.getFileStream(key);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error al transmitir archivo:', error);
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
};
exports.getUserWithDocuments = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario pasado como parámetro
    const userData = await documentService.getUserWithDocuments(id);

    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllUsersWithDocuments = async (req, res) => {
  try {
    // Llamar al servicio para obtener todos los usuarios con documentos
    const usersWithDocuments = await documentService.getAllUsersWithDocuments();
    res.status(200).json(usersWithDocuments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};