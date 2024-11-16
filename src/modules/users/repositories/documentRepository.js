const Document = require('../models/Document');

// Obtener documentos de MongoDB por el ID del usuario
exports.getPendingDocumentsByUserId = async (usuarioId) => {
  return await Document.find({ usuario_id: usuarioId, estado: 'pendiente' });
};
exports.getDocumentByIdUser = async (userId) => {
  const contador = await Document.countDocuments({ usuarioId: userId });
  return contador > 0;
};
exports.enviarTrueDocument = async (usuarioId) => {
  const totalDocumentos = await Document.countDocuments({ usuario_id: usuarioId });

  if (totalDocumentos === 0) return false;

  const tieneDocumentosPendientes = await Document.findOne({ 
    usuario_id: usuarioId, 
    estado: 'pendiente' 
  });

  return tieneDocumentosPendientes === null;
};

exports.countDocumentsPending = async (usuarioId) => {
  return await Document.countDocuments({ usuario_id: usuarioId, estado: 'pendiente' });
};

exports.createDocument = async (documentData) => {
  return await Document.create(documentData);
};

exports.deleteDocumentsByUserId = async (usuarioId) => {
  await Document.deleteMany({ usuario_id: usuarioId });
};

exports.updateDocumentStatusByUserId = async (estado, usuarioId) => {
  const result = await Document.updateMany(
    { usuario_id: usuarioId }, 
    { $set: { estado: estado } } 
  );
  return result;
};

