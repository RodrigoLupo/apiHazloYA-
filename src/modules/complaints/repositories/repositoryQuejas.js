const Queja = require('../models/Quejas');

exports.createQueja = async (quejaData) => {
  return await Queja.create(quejaData);
};

exports.getQuejasByUserId = async (usuarioId) => {
  return await Queja.findAll({ where: { usuario_id: usuarioId } });
};

exports.getQuejasByTrabajoId = async (trabajoId) => {
  return await Queja.findAll({ where: { trabajo_id: trabajoId } });
};

exports.deleteQueja = async (quejaId) => {
  return await Queja.destroy({ where: { id: quejaId } });
};
exports.getAllQuejas = async (page, limit) => {
    const offset = (page - 1) * limit;

    return await Queja.findAndCountAll({
        order: [['fecha', 'DESC']],
        limit,
        offset
    });
};
