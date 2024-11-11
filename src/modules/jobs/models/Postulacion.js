// src/modules/jobs/models/Postulacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const User = require('../../users/models/User');
const Trabajo = require('./Trabajo');

const Postulacion = sequelize.define('Postulacion', {
  trabajo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trabajo,
      key: 'id'
    }
  },
  colaborador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  precio_ofrecido: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tiempo_estimado: { type: DataTypes.INTEGER, allowNull: false },  // en días
  estado: {
    type: DataTypes.ENUM('Postulado', 'Visto', 'Aceptado', 'Rechazado'),
    defaultValue: 'Postulado'
  }
}, {
  timestamps: false
});

Postulacion.belongsTo(Trabajo, { foreignKey: 'trabajo_id', as: 'trabajo' });
Postulacion.belongsTo(User, { foreignKey: 'colaborador_id', as: 'colaborador' });

module.exports = Postulacion;
