const DataTypes = require('sequelize');

const sequelize = require('../util/database');



const Topic = sequelize.define('asset', {
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
 
contentHtml: {
    type: DataTypes.STRING,
    allowNull: false
}

});



module.exports = Topic;