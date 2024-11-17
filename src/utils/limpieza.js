const fs = require('fs');
const path = require('path');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Document = require('../modules/users/models/Document'); 

const DEV_MODE = process.env.DEV_MODE === 'true';
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.deleteRejectedDocumentsAndFiles = async () => {
  try {
    // Fecha límite: documentos subidos hace más de 24 horas
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Buscar documentos rechazados o sin estado
    const documents = await Document.find({
      $or: [{ estado: 'rechazado' }, { estado: null }],
      fecha_subida: { $lt: cutoffDate },
    });

    for (const doc of documents) {
      if (DEV_MODE) {
        // Modo desarrollo: eliminar archivo local
        const filePath = path.resolve(__dirname, '../../uploads', doc.ruta_archivo.split('uploads/')[1]);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Archivo local eliminado: ${filePath}`);
          } catch (error) {
            console.error(`Error al eliminar archivo local ${filePath}:`, error);
          }
        } else {
          console.warn(`Archivo local no encontrado: ${filePath}`);
        }
      } else {
        // Modo producción: eliminar archivo del bucket S3
        const params = {
          Bucket: BUCKET_NAME,
          Key: doc.nombre_key, // Asumiendo que guardas el `nombre_key` en la BD
        };

        try {
          await s3Client.send(new DeleteObjectCommand(params));
          console.log(`Archivo eliminado del bucket S3: ${doc.nombre_key}`);
        } catch (error) {
          console.error(`Error al eliminar archivo del bucket S3: ${doc.nombre_key}`, error);
        }
      }
    }

    // Eliminar documentos rechazados de la base de datos
    const result = await Document.deleteMany({
      $or: [{ estado: 'rechazado' }, { estado: null }],
      fecha_subida: { $lt: cutoffDate },
    });

    console.log(`${result.deletedCount} documentos rechazados eliminados de la base de datos.`);
  } catch (error) {
    console.error('Error al eliminar documentos rechazados y sus archivos:', error);
  }
};
