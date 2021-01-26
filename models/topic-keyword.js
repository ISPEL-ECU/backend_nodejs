const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const TopicKeyword = sequelize.define('topic-keyword', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  }});



module.exports = TopicKeyword;