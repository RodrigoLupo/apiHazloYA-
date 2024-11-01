// src/modules/auth/controllers/authController.js

const userRepository = require('../../users/repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
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
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error de servidor' });
  }
};
module.exports = {
  login,
};