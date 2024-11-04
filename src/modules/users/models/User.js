const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  tipo_usuario: {
    type: DataTypes.ENUM('colaborador', 'contratista', 'admin', 'encargado'),
    allowNull: false
  },  
  estado: { type: DataTypes.BOOLEAN, defaultValue: false },
  pais: { type: DataTypes.STRING },
  ciudad: { type: DataTypes.STRING },
  distrito: { type: DataTypes.STRING },
  ubicacion_mapa: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  calificacion: { type: DataTypes.FLOAT, defaultValue: 0 },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

module.exports = User;