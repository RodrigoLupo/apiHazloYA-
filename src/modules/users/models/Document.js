const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const documentSchema = new mongoose.Schema({
  usuario_id: { type: Number, required: true },
  nombre_key: { type: String, default: ()=> uuidv4() },
  tipo_documento: { type: String, enum: ['dni', 'antecedentes'], required: true },
  ruta_archivo: { type: String, required: true },
  fecha_subida: { type: Date, default: Date.now },
  estado: {type: String, default: 'pendiente', enum: ['pendiente', 'aprobado', 'rechazado'], required: true}
});

module.exports = mongoose.model('Document', documentSchema);
