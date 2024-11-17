const Document = require('../models/Document');
const documentRepository = require('../repositories/documentRepository');
const userService = require('../services/userService');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const config = {
  devMode: process.env.DEV_MODE === 'true',
  bucketName: process.env.S3_BUCKET_NAME,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};
const s3 = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});
exports.saveDocument = async (usuarioId, tipoDocumento, filePath) => {
  const newDocument = new Document({
    usuario_id: usuarioId,
    tipo_documento: tipoDocumento,
    ruta_archivo: filePath,
    fecha_subida: new Date()
  });
  
  return await newDocument.save();
};
exports.uploadFile = async (file, key) => {
  if (config.devMode) {
    const filePath = path.join(__dirname, '../../../../uploads/', key);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${key}`;
  } else {
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3.send(command);
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
  }
};

exports.getFileStream = async (key) => {
  if (config.devMode) {
    const localPath = path.join(__dirname, '../uploads/', key);
    return fs.createReadStream(localPath);
  } else {
    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });
    const { Body } = await s3.send(command);
    return Body;
  }
};

exports.getUserWithDocuments = async (usuarioId) => {
  // Obtener el usuario desde MySQL
  const user = await userService.getUserById(usuarioId);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Obtener los documentos del usuario desde MongoDB
  const documents = await documentRepository.getPendingDocumentsByUserId(usuarioId);

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      tipo: user.tipo_usuario,
      estado: user.estado,
      fecha_registro: user.fecha_registro
    },
    documents: documents.map(doc => ({
      tipo_documento: doc.tipo_documento,
      nombre_key: doc.nombre_key,
      fecha_subida: doc.fecha_subida
    }))
  };
};

exports.getAllUsersWithDocuments = async () => {
  // Obtener todos los usuarios con estado false desde MySQL
  const users = await userService.getUsersByState(false);
  
  // Iterar sobre los usuarios para obtener sus documentos
  const usersWithDocuments = await Promise.all(users.map(async (user) => {
    const documents = await documentRepository.countDocumentsPending(user.id);
    if (documents === 0) return null;
    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      tipo: user.tipo_usuario,
      fecha_registro: user.fecha_registro,
      documentos_pendientes: documents
    };
  }));

  return usersWithDocuments.filter(user => user !== null);
};