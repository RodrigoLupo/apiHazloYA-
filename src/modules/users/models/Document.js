const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  usuario_id: { type: String, required: true },
  tipo_documento: { type: String, enum: ['dni', 'antecedentes'], required: true },
  ruta_archivo: { type: String, required: true },
  fecha_subida: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
