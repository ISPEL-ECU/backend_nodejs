const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const TopicAreas = sequelize.define('topic-areas', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  }});



module.exports = TopicAreas;