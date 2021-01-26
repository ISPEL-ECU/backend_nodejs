const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Alias = sequelize.define('alias', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
   value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
 
}});



module.exports = Alias;