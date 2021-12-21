const { Sequelize,DataTypes,Model } = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });
const db = async function(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = db;