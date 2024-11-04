// src/modules/users/repositories/userRepository.js

const User = require('../models/User');

// Crear un nuevo usuario
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
  if (user) {
    await user.destroy();
    return true;
  }
  throw new Error('Usuario no encontrado');
};

exports.getAllUsers = async (offset, limit) => {
  return await User.findAll({ where: { estado: true }, offset, limit });
};

exports.getAllInactiveUsers = async (offset, limit) => {
  return await User.findAll({ where: { estado: false }, offset, limit });
};

exports.countUsers = async () => {
  return await User.count({ where: { estado: true } });
};

exports.countInactiveUsers = async () => {
  return await User.count({ where: { estado: false } });
};