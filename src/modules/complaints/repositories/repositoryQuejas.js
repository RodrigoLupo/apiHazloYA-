const Queja = require('../models/Quejas');
const User = require('../../users/models/User');
const { Sequelize } = require('sequelize');

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
exports.getAllQuejas = async (page, limit, estado) => {
    const offset = (page - 1) * limit;

    return await Queja.findAndCountAll({
        where: { estado },
        order: [['fecha', 'DESC']],
        limit,
        offset,
        include: [
          {
            model: User,
            as : 'usuario',
            attributes: ['nombre', 'apellido']
          }
        ]
    });
};
exports.updateQuejaEstado = async (id, estado) => {
  const queja = await Queja.findByPk(id);

  if (!queja) {
    throw new Error('La queja no existe');
  }

  queja.estado = estado;
  await queja.save();

  return queja;
};

exports.getQuejasCount = async () => {
  const counts = await Queja.findAll({
    attributes: [
      'estado',
      [Sequelize.fn('COUNT', Sequelize.col('estado')), 'cantidad']
    ],
    group: ['estado']
  });

  const total = await Queja.count();

  // Formateamos los resultados
  const estados = counts.reduce((acc, item) => {
    acc[item.estado] = parseInt(item.dataValues.cantidad, 10);
    return acc;
  }, {});

  return {
    estados,
    total
  };
};