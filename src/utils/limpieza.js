const fs = require('fs');
const path = require('path');
const Document = require('../modules/users/models/Document'); 
exports.deleteRejectedDocumentsAndFiles = async () => {
  try {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); 

    const documents = await Document.find({
      $or: [{ estado: 'rechazado' }, { estado: null }],
      //fecha_subida: { $lt: cutoffDate }
    });

    for (const doc of documents) {
      const filePath = path.resolve(__dirname, '../../uploads', doc.ruta_archivo.split('uploads/')[1]);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Archivo eliminado: ${filePath}`);
        } catch (error) {
          console.error(`Error al eliminar archivo ${filePath}:`, error);
        }
      } else {
        console.warn(`Archivo no encontrado: ${filePath}`);
      }
    }

    const result = await Document.deleteMany({
      $or: [{ estado: 'rechazado' }, { estado: null }],
      //fecha_subida: { $lt: cutoffDate }
    });

    console.log(`${result.deletedCount} documentos rechazados eliminados de la base de datos.`);
  } catch (error) {
    console.error('Error al eliminar documentos rechazados y sus archivos:', error);
  }
};