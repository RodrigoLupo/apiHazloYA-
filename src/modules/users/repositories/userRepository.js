const User = require('../models/User');

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.updateUserState = async (userId, state) => {
  return await User.update({ estado: state }, { where: { id: userId } });
};
