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

// Buscar usuario por email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};