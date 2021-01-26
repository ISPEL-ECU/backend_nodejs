const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Area = sequelize.define('area', {
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
shortName: {
    type: DataTypes.STRING,
      allowNull: false,
      unique: true
}
});



module.exports = Area;