const TokenBlacklist = require('../models/TokenBlacklist');

exports.addTokenToBlacklist = async (token, expiresAt) => {
  return await TokenBlacklist.create({ token, expiresAt });
};

exports.isTokenBlacklisted = async (token) => {
  const blacklistedToken = await TokenBlacklist.findOne({ token });
  return !!blacklistedToken;
};