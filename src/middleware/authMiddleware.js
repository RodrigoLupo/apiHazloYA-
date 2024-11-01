const jwt = require('jsonwebtoken');
const userRepository = require('../modules/users/repositories/userRepository');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si es un token temporal
    if (decoded.temporal) {
      const user = await userRepository.findUserById(decoded.id);
      
      // Si el usuario ya está activado, el token temporal es inválido
      if (user.estado) {
        return res.status(401).json({ message: 'Token temporal inválido, usuario activado.' });
      }
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};