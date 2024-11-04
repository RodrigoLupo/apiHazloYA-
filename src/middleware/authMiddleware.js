const jwt = require('jsonwebtoken');
const userRepository = require('../modules/users/repositories/userRepository');
const blacklistService = require('../modules/users/services/blacklistService');

// Middleware de verificación de token con logging detallado
exports.verifyToken = async (req, res, next) => {
  try {
    // Verificar que el encabezado de autorización esté presente y en el formato correcto
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Encabezado de autorización ausente o en formato incorrecto.');
      return res.status(403).json({ message: 'Token no proporcionado o en formato incorrecto' });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Verificar si el token está en la lista negra
    if (await blacklistService.isTokenBlacklisted(token)) {
      console.log('El token está en la lista negra.');
      return res.status(401).json({ message: 'Token inválido o bloqueado' });
    }

    // Verificar el token usando jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si es un token temporal y si el usuario ya está activado
    if (decoded.temporal) {
      const user = await userRepository.findUserById(decoded.id);
      if (user.estado) {
        console.log('Token temporal inválido, usuario ya activado.');
        return res.status(401).json({ message: 'Token temporal inválido, usuario activado.' });
      }
    }

    // Pasar el ID del usuario al siguiente middleware
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Log detallado del error
    console.error('Error durante la verificación del token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    } else {
      return res.status(500).json({ message: 'Error en la verificación del token.' });
    }
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userRepository.findUserById(req.userId);

    if (!user || user.tipo_usuario !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de administrador.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar rol de administrador.' });
  }
};

exports.isEncargadoOrAdmin = async (req, res, next) => {
  try {
    const user = await userRepository.findUserById(req.userId);

    if (!user || (user.tipo_usuario !== 'encargado' && user.tipo_usuario !== 'admin')) {
      return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de encargado o administrador.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar rol de encargado o administrador.' });
  }
};
