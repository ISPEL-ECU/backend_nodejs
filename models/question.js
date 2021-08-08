const DataTypes = require('sequelize');


const sequelize = require('../util/database');

const Question = sequelize.define('questions', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
   value: {
      type: DataTypes.TEXT,
      allowNull: false
 
}});



module.exports = Question;