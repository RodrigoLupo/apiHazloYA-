const Document = require('../models/Document');

exports.saveDocument = async (usuarioId, tipoDocumento, filePath) => {
  const newDocument = new Document({
    usuario_id: usuarioId,
    tipo_documento: tipoDocumento,
    ruta_archivo: filePath,
    fecha_subida: new Date()
  });
  
  return await newDocument.save();
};
