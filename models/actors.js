const sqlite3 = require('sqlite3').verbose();
const { Sequelize,DataTypes,Model } = require('sequelize');
const Film = require('./movies')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });

const Actor = sequelize.define('Actor', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
 // Actor.belongsTo(Film, { as: 'actors', constraints: false });

  (async () => {
    await sequelize.sync({ force: true });
    //const jane = await User.create({ firstName: "Ina" ,lastName:"Karter"});
    //console.log(jane.toJSON());
  })();
module.exports = Actor;