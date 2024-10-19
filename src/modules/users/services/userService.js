const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta según la estructura de tu proyecto

exports.registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    ...userData,
    password: hashedPassword,
    estado: false // Pending verification
  };
  const user = await userRepository.createUser(newUser);
  
  // Generate a temporary token for the verification process (3-day validity)
  const tempToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3d' });

  return { user, tempToken }; // Return the user and the tempToken
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
exports.login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) return null;
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
  
    return user;
};
