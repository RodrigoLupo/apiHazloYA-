const Document = require('../models/Document');

// Obtener documentos de MongoDB por el ID del usuario
exports.getDocumentsByUserId = async (usuarioId) => {
  return await Document.find({ usuario_id: usuarioId });
};

exports.createDocument = async (documentData) => {
  return await Document.create(documentData);
};
