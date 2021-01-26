const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const UserDomain = sequelize.define('user-domain', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  }});



module.exports = UserDomain;