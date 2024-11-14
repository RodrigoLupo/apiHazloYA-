const mongoose = require('mongoose');

const oficioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  colaboradores: [{ type: Number }]  // IDs de colaboradores relacionados
});

module.exports = mongoose.model('Oficio', oficioSchema);