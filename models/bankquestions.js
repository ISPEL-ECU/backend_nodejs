const DataTypes = require('sequelize');


const sequelize = require('../util/database');

const bankquestions = sequelize.define('bankquestions', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  question_name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correct: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distractor1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distractor2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distractor3: {
    type: DataTypes.STRING,
    allowNull: false
  },
});



module.exports = bankquestions;