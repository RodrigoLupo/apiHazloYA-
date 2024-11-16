// src/modules/jobs/models/Trabajo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const User = require('../../users/models/User');

const Trabajo = sequelize.define('Trabajo', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  duracion: { type: DataTypes.INTEGER, allowNull: false },  // en días
  contratista_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  distrito: { type: DataTypes.STRING},
  ubicacion: { type: DataTypes.STRING},
  estado: {
    type: DataTypes.ENUM('Abierto', 'Cerrado','En proceso', 'Cancelado'),
    defaultValue: 'Abierto'
  },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

Trabajo.belongsTo(User, { foreignKey: 'contratista_id', as: 'contratista' });

module.exports = Trabajo;
