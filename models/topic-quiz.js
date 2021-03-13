const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const TopicQuiz = sequelize.define('topic-quiz', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  }});



module.exports = TopicQuiz;