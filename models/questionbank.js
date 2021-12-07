const DataTypes = require('sequelize');


const sequelize = require('../util/database');

const questionbank = sequelize.define('questionbank', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teaser: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});



module.exports = questionbank;