const userRepository = require('../../users/repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistService = require('../services/blacklistService');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user || !['colaborador', 'contratista'].includes(user.tipo_usuario)) {
      return res.status(404).json({ error: 'Accesso solo para usuarios del aplicativo' });
    }

    if (!user.estado) {
      // If user is not activated, return a response indicating that
      return res.status(403).json({ error: 'No autorizado comunicate con central' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales Invalidas' });
    }

    // Generate a token for regular login (can be refreshed if needed)
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error de servidor' });
  }
};

const loginAdminOrEncargado = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user || !['admin', 'encargado'].includes(user.tipo_usuario)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    if (!user.estado) {
      return res.status(403).json({ error: 'Usuario no autorizado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.tipo_usuario }, process.env.JWT_SECRET);
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error de servidor' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    await blacklistService.addTokenToBlacklist(token);
    return res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el logout' });
  }
};

module.exports = {
  login,
  loginAdminOrEncargado,
  logout,
};