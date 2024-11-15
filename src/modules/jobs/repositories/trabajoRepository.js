const Trabajo = require('../models/Trabajo');
const User = require('../../users/models/User');
const { Op } = require('sequelize');

exports.createTrabajo = async (trabajoData) => {
    return await Trabajo.create(trabajoData);
};
exports.findTrabajoById = async (trabajoId) => {
    return await Trabajo.findByPk(trabajoId);
};
exports.findAllTrabajos = async (criteria) => {
    return await Trabajo.findAll({ where: { criteria } });
};
exports.updateTrabajoStatus = async (id, newStatus) => {
    const trabajo = await this.findTrabajoById(id);
    if (trabajo) {
        return await trabajo.update({ estado: newStatus });
    }
    throw new Error('Trabajo no encontrado');
};

exports.findUltimosTrabajosByContratista = async (contratistaId, page) => {
    return await Trabajo.findAll({
        where: { contratista_id: contratistaId },
        attributes: ['id','titulo', 'descripcion', 'precio', 'duracion', 'distrito', 'fecha_creacion'],
        order: [['fecha_creacion', 'DESC']],  // Orden descendente para obtener los últimos trabajos
        limit: 10,
        offset: (page - 1) * 10
    });
};

exports.findTrabajosByDistrito = async (distrito, page) => {
    return await Trabajo.findAll({
        where: { distrito, estado: 'Abierto' },
        include: [
            {
                model: User,
                as: 'contratista',
                attributes: ['id','nombre', 'calificacion']  // Solo nombre y calificación del contratista
            }
        ],
        attributes: ['id','titulo', 'descripcion', 'precio', 'duracion', 'distrito'],  // Datos del trabajo
        order: [['fecha_creacion', 'DESC']],
        limit: 10,
        offset: (page - 1) * 10
    });
};
exports.countTrabajosByDistrito = async (distrito) => {
    return await Trabajo.count({
        where: { distrito, estado: 'Abierto' }
    });
};
exports.countTrabajos = async () => {
    return await Trabajo.count();
};
exports.findTrabajosByTitleAndLocation = async ({ search, ciudad, distrito, estado = 'Abierto', offset, limit }) => {
  const whereCondition = {
    estado,
    ...(search && { titulo: { [Op.like]: `%${search}%` } }), // Filtro por título si se especifica
  };

  const { rows: trabajos, count: total } = await Trabajo.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: 'contratista',
        where: { ciudad }, // Filtra por ciudad en el modelo User (contratista)
        attributes: ['id','nombre', 'apellido', 'ciudad'],
      },
    ],
    attributes: ['id' , 'titulo', 'descripcion', 'estado', 'precio', 'duracion', 'fecha_creacion'],
    order: [
      ['distrito', distrito ? 'DESC' : 'ASC'],
      ['fecha_creacion', 'ASC'],
    ],
    offset,
    limit,
  });
  return { trabajos, total };
};
