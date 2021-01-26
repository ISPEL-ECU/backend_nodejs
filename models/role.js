const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Role = sequelize.define('role', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  roleName: {
      type: DataTypes.STRING,
      allowNull: false
  },
  roleCode: {
      type: DataTypes.STRING,
      allowNull: false
  }
});



module.exports = Role;