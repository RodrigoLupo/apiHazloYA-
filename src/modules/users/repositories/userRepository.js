const User = require('../models/User');
const { Op } = require('sequelize');
const documentRepository = require('./documentRepository');
exports.createUser = async (userData) => {
  return await User.create(userData);
};

// Actualizar el estado del usuario
exports.updateUserState = async (userId, state) => {
  return await User.update({ estado: state }, { where: { id: userId } });
};
exports.findUserById = async (userId) => {
  return await User.findByPk(userId);
};
exports.adminExists = async () => {
  return await User.findOne({ where: { tipo_usuario: 'admin' } }) != null;
};
// Buscar usuario por email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};
exports.updateUser = async (id, userData) => {
  const user = await this.findUserById(id);
  if (user) {
    return await user.update(userData);
  }
  throw new Error('Usuario no encontrado');
};

exports.deleteUser = async (id) => {
  const user = await this.findUserById(id);
  if (user && user.estado==false && user.tipo_usuario!='admin') {
    await user.destroy();
    return true;
  }
  throw new Error('Usuario no encontrado');
};
exports.findUserStatusById = async (id) => {
  const user = await this.findUserById(id);
  if (user) {
    return { estado: user.estado };  // Retorna un objeto con la propiedad `estado`
  }
  throw new Error('Usuario no encontrado');
};
exports.getAllUsers = async (offset, limit) => {
  return await User.findAll({ where: { estado: true,
    [Op.or]: [{ tipo_usuario: 'colaborador' }, { tipo_usuario: 'contratista' }]
   }, order:[['fecha_registro', 'DESC']], offset, limit });
};

exports.getAllInactiveUsers = async (offset, limit) => {
  const allInactiveUsers = await User.findAll({ 
    where: { 
      estado: false,
      [Op.or]: [
        { tipo_usuario: 'colaborador' }, 
        { tipo_usuario: 'contratista' }
      ]
    },
    order: [['fecha_registro', 'DESC']],
    offset, 
    limit
  });

  const filteredUsers = await Promise.all(allInactiveUsers.map(async (user) => {
    const tieneDocumentosValidos = await documentRepository.enviarTrueDocument(user.id);
    return tieneDocumentosValidos ? user : null;
  }));

  return filteredUsers.filter(user => user !== null);
};

exports.countUsers = async () => {
  return await User.count({ where: { estado: true
    , [Op.or]: [{ tipo_usuario: 'colaborador' }, { tipo_usuario: 'contratista' }] 
   } });
};

exports.countInactiveUsers = async () => { 
  const allInactiveUsers = await User.findAll({ 
    where: { 
      estado: false,
      [Op.or]: [
        { tipo_usuario: 'colaborador' }, 
        { tipo_usuario: 'contratista' }
      ]
    }
  });

  const filteredUsers = await Promise.all(allInactiveUsers.map(async (user) => {
    const tieneDocumentosValidos = await documentRepository.enviarTrueDocument(user.id);
    return tieneDocumentosValidos ? user : null;
  }));

  return filteredUsers.filter(user => user !== null).length;
};

exports.findColaboradoresByLocation = async ({ colaboradorIds, ciudad, distrito, offset, limit, search, searchl }) => {
  const whereCondition = {
    id: colaboradorIds,
    ciudad,
    estado: true,
    tipo_usuario: 'colaborador',
  };

  // Añadir búsqueda por nombre o apellido si se proporciona el parámetro "search"
  if (search) {
    whereCondition[Op.or] = [
      { nombre: { [Op.like]: `%${search}%` } },
      { apellido: { [Op.like]: `%${searchl}%` } },
    ];
  }

  return await User.findAll({
    where: whereCondition,
    attributes: ['id', 'nombre', 'apellido', 'calificacion'],
    order: [
      ['distrito', distrito ? 'DESC' : 'ASC'],
      ['fecha_registro', 'DESC'],
    ],
    offset,
    limit,
  });
};

exports.countUsuariosByTipoAndEstado = async (tipo, estado = true) => {
  return await User.count({
    where: {
      tipo_usuario: tipo,
      estado
    }
  });
};
exports.findUsersByNameOrLastName = async (name, lastName) => {
  const whereClause = {estado: true};
  
  if (name) {
      whereClause.nombre = { [Op.like]: `%${name}%` };
  }
  if (lastName) {
      whereClause.apellido = { [Op.like]: `%${lastName}%` };
  }

  return await User.findAll({
      where: whereClause,
      attributes: ['id', 'nombre', 'apellido', 'email', 'telefono', 'estado', 'fecha_registro'],
      order: [['fecha_registro', 'DESC']]
  });
};