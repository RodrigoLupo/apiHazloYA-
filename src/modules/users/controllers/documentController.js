const documentService = require('../services/documentService');

exports.uploadDocument = async (req, res) => {
  try {
    const { tipo_documento } = req.body;
    const filePath = req.file.path; // La ruta donde se guarda el archivo
    const usuarioId = req.params.id;

    const documento = await documentService.saveDocument(usuarioId, tipo_documento, filePath);
    res.status(201).json({ message: 'Documento subido correctamente', documento });
  } catch (error) {
    res.status(400).json({ error: error.message });
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