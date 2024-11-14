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

exports.countColaboradoresPorOficio = async () => {
  // Obtener todos los oficios con sus colaboradores
  const oficios = await Oficio.find().populate('colaboradores', '_id'); // Solo trae el ID de colaboradores

  // Crear un array con el nombre del oficio y el conteo de colaboradores
  const resultado = oficios.map(oficio => ({
    nombre: oficio.nombre,
    colaboradoresCount: oficio.colaboradores.length,
  }));

  // Calcular el total de oficios y encontrar el oficio con el máximo número de colaboradores
  const totalOficios = resultado.length;
  const maxOficio = resultado.reduce((max, oficio) => 
    oficio.colaboradoresCount > max.colaboradoresCount ? oficio : max, 
    { colaboradoresCount: 0 }
  );

  return {
    totalOficios,
    oficios: resultado,
    maxOficio
  };
};

exports.findAllOficios = async () => {
  return await Oficio.find({}, 'nombre _id');
};

exports.checkarColaboradorInOficios = async (colaboradorId) => {
  const oficio =  await Oficio.findOne({ colaboradores: colaboradorId });
  return !!oficio;
};