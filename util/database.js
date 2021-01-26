const Sequelize = require('sequelize');

const sequelize = new Sequelize('elm', 'postgres', 'Qwerty1@', {
    dialect: 'postgres',
    host: 'localhost'
});

module.exports = sequelize;
