const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Keyword = require('./keyword');

const Topic = sequelize.define('topic', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  topicId: {
      type: DataTypes.STRING,
      allowNull: false
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  
  teaser: {
      type:DataTypes.TEXT,
      allowNull: false
  },
 
contentHtml: {
    type: DataTypes.STRING,
    allowNull: false
},
contentRmd: {
    type: DataTypes.STRING,
    allowNull: true
}

});



module.exports = Topic;