const Sequelize = require('sequelize');

const sequelize = new Sequelize('production', 'produser', 'Qwerty1@', {
    dialect: 'postgres',
    host: 'localhost',
    port: 65432
});

module.exports = sequelize;
