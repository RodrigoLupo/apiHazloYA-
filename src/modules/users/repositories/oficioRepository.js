// repositories/oficioRepository.js
const Oficio = require('../models/Oficio');

exports.createOficio = async (nombre) => {
  return await Oficio.create({ nombre });
};

exports.addColaborador = async (oficioId, colaboradorId) => {
  return await Oficio.findByIdAndUpdate(
    oficioId,
    { $addToSet: { colaboradores: colaboradorId } },
    { new: true }
  );
};

exports.getColaboradoresByOficio = async (nombre) => {
  return await Oficio.findOne({ nombre });
};

exports.editOficio = async (oficioId, nombre) => {
  return await Oficio.findByIdAndUpdate(oficioId, { nombre }, { new: true });
};

exports.deleteOficio = async (oficioId) => {
  return await Oficio.findByIdAndDelete(oficioId);
};

exports.countColaboradoresPorOficio = async (nombre) => {
  const oficio = await Oficio.findOne({ nombre });
  return oficio ? oficio.colaboradores.length : 0;
};
