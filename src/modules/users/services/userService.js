const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta según la estructura de tu proyecto

exports.registerUser = async (userData) => {
  if (!['colaborador', 'contratista'].includes(userData.tipo_usuario)) {
    throw new Error('Solo los tipos colaborador o contratista están permitidos para registro.');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    ...userData,
    password: hashedPassword,
    estado: false
  };

  const user = await userRepository.createUser(newUser);

  const tokenTemporal = jwt.sign({ id: user.id, temporal: true }, process.env.JWT_SECRET, { expiresIn: '3d' });
  return { user, tokenTemporal };
};
exports.createEncargadoOrAdmin = async (adminId, userData) => {
  const admin = await userRepository.findUserById(adminId);
  if (admin.tipo_usuario !== 'admin') {
    throw new Error('Permisos insuficientes.');
  }
  if (!['encargado', 'admin'].includes(userData.tipo_usuario)) {
    throw new Error('Tipo de usuario inválido.');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
    estado: true
  });

  return newUser;
};

// Crear un admin inicial si no existe ninguno
exports.ensureAdminExists = async () => {
  const adminExists = await userRepository.adminExists();
  if (!adminExists) {
    await userRepository.createUser({
      nombre: 'Admin',
      apellido: 'System',
      email: 'admin@system.com',
      password: await bcrypt.hash('securepassword', 10),
      tipo_usuario: 'admin',
      estado: true
    });
  }
};
// Obtener el usuario por ID desde MySQL
exports.getUserById = async (userId) => {
  return await User.findByPk(userId); // Busca el usuario por su primary key (id)
};
exports.getUsersByState = async (state) => {
  return await User.findAll({ where: { estado: state } });
};
// Activar el usuario cambiando su estado a true
exports.activateUser = async (userId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  user.estado = true;
  await user.save();

  return user;
};
exports.getActiveUsers = async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const users = await userRepository.getAllUsers(offset, limit);
  const total = await userRepository.countUsers();
  return { users, total };
};

exports.getInactiveUsers = async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const users = await userRepository.getAllInactiveUsers(offset, limit);
  const total = await userRepository.countInactiveUsers();
  return { users, total };
};