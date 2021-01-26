const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const TopicAlias = sequelize.define('topic-alias', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  }});



module.exports = TopicAlias;