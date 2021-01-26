const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  firstName: {
      type: DataTypes.STRING,
      allowNull: false
  },
  lastName: {
      type: DataTypes.STRING,
      allowNull: false
  },
  password:{
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
      type:DataTypes.STRING,
      allowNull: false
  },
  admin:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
  });



module.exports = User;