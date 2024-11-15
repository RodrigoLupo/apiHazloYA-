const Document = require('../models/Document');
const documentRepository = require('../repositories/documentRepository');
const userService = require('../services/userService');
const path = require('path');

exports.saveDocument = async (usuarioId, tipoDocumento, filePath) => {
  const newDocument = new Document({
    usuario_id: usuarioId,
    tipo_documento: tipoDocumento,
    ruta_archivo: filePath,
    fecha_subida: new Date()
  });
  
  return await newDocument.save();
};
exports.getUserWithDocuments = async (usuarioId) => {
  // Obtener el usuario desde MySQL
  const user = await userService.getUserById(usuarioId);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Obtener los documentos del usuario desde MongoDB
  const documents = await documentRepository.getDocumentsByUserId(usuarioId);

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      estado: user.estado,
      fecha_registro: user.fecha_registro
    },
    documents: documents.map(doc => ({
      tipo_documento: doc.tipo_documento,
      ruta_archivo: `http://localhost:3000/uploads/${path.basename(doc.ruta_archivo)}`,
      fecha_subida: doc.fecha_subida
    }))
  };
};

exports.getAllUsersWithDocuments = async () => {
  // Obtener todos los usuarios con estado false desde MySQL
  const users = await userService.getUsersByState(false);
  
  // Iterar sobre los usuarios para obtener sus documentos
  const usersWithDocuments = await Promise.all(users.map(async (user) => {
    const documents = await documentRepository.getPendingDocumentsByUserId(user.id);
    if (documents.length === 0) return null;
    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      estado: user.estado,
      fecha_registro: user.fecha_registro,
      documents: documents.map(doc => ({
        tipo_documento: doc.tipo_documento,
        ruta_archivo: `http://localhost:3000/uploads/${path.basename(doc.ruta_archivo)}`
      }))
    };
  }));

  return usersWithDocuments.filter(user => user !== null);
};