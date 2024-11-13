const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  contratistaId: { type: Number, required: true },
  trabajoId: { type: Number, required: true },
  colaboradorId: { type: Number, required: true },
  puntualidad: { type: Number, required: true, min: 1, max: 5 },
  calidad: { type: Number, required: true, min: 1, max: 5 },
  comunicacion: { type: Number, required: true, min: 1, max: 5 },
  fecha_calificacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);