const DataTypes = require('sequelize');

const Topic = require('./topic');

const sequelize = require('../util/database');

const Keyword = sequelize.define('keyword', {
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



module.exports = Keyword;