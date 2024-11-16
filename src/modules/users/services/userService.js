const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta según la estructura de tu proyecto
const documentRepository = require('../repositories/documentRepository');
const trabajoRepository = require('../../jobs/repositories/trabajoRepository');

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
  return { tokenTemporal };
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
exports.rechazar = async (userId) => {
  await userRepository.deleteUser(userId);
  const documentos = await documentRepository.getDocumentByIdUser(userId);
  if (!documentos) {
    await documentRepository.updateDocumentStatusByUserId("rechazado", userId);
  }
}
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
  const estado_documento = await documentRepository.updateDocumentStatusByUserId("aprobado",userId);
    if(estado_documento){
      const user = await userRepository.findUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.estado = true;
    await user.save();

    return user;
  }
  throw new Error('Documento no encontrado');
};
exports.deactivateUser = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }else if(user.tipo_usuario === 'admin'){
    throw new Error('No puedes desactivar a un administrador');
  }
  user.estado = false;
  await user.save();
};
exports.getActiveUsers = async (page = 1, tipoUsuario) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const users = await userRepository.getAllUsers(offset, limit, tipoUsuario);
  const total = await userRepository.countUsers(tipoUsuario);
  return { users, total };
};

exports.getInactiveUsers = async (page = 1, tipoUsuario) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const users = await userRepository.getAllInactiveUsers(offset, limit, tipoUsuario);
  const total = await userRepository.countInactiveUsers(tipoUsuario);
  return { users, total };
};

exports.getStateById = async (userId) => { 
  const estado = await userRepository.findUserStatusById(userId);
  return estado;  // Retorna el objeto `{ estado }` recibido desde el repositorio
};
exports.getReport = async () => {
  const nroTrabajos = await trabajoRepository.countTrabajos();
  const nroColaboradoresActivos = await userRepository.countUsuariosByTipoAndEstado('colaborador');
  const nroContratistasActivos = await userRepository.countUsuariosByTipoAndEstado('contratista');

  return {
    nroTrabajos,
    nroColaboradoresActivos,
    nroContratistasActivos
  };
};
exports.searchUsersByNameOrLastName = async (name, lastName) => {
  const users = await userRepository.findUsersByNameOrLastName(name, lastName);

  return users.map(user => ({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      estado: user.estado,
      fecha_registro: user.fecha_registro
  }));
};