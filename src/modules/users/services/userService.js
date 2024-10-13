const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

exports.registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    ...userData,
    password: hashedPassword,
    estado: false // Se activa tras revisión del admin
  };
  return await userRepository.createUser(newUser);
};

exports.activateUser = async (userId) => {
  return await userRepository.updateUserState(userId, true);
};
exports.login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) return null;
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;
  
    return user;
  };