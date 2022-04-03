const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Course = sequelize.define('course', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
 
},
topics_list: {
    type: DataTypes.JSON,
      allowNull: false,
      unique: false
},
nodes: {
    type: DataTypes.JSON,
      allowNull: true,
      unique: false
},
edges: {
    type: DataTypes.JSON,
      allowNull: true,
      unique: false
},


});



module.exports = Course;