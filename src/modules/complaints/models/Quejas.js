const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const Trabajo = require('../../jobs/models/Trabajo');
const User = require('../../users/models/User');

const Queja = sequelize.define('Queja', {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  trabajo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Trabajo, key: 'id' }
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  implicado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('Contratista', 'Colaborador'),
    allowNull: false
  },
  estado:{
    type: DataTypes.ENUM('Pendiente', 'Vista', 'Resuelto'),
    defaultValue: 'Pendiente'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

Queja.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
Queja.belongsTo(Trabajo, { foreignKey: 'trabajo_id', as: 'trabajo' });

module.exports = Queja;
