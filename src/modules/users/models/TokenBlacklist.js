const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: Date.now}  // Fecha de expiración del token
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);