const sqlite3 = require('sqlite3').verbose();
const { Sequelize,DataTypes,Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });

const User = sequelize.define('User', {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }, 
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
      confirmPassword: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
  });
  (async () => {
    await sequelize.sync({ force: true });
    //const jane = await User.create({ firstName: "Ina" ,lastName:"Karter"});
    //console.log(jane.toJSON());
  })();
module.exports = User;