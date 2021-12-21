const sqlite3 = require('sqlite3').verbose();
const { Sequelize,DataTypes,Model } = require('sequelize');
const Actor = require('./actors')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });

const Film = sequelize.define('Films', {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }, 
    format: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
  });
  /*
  Film.associate = models =>{
        Film.hasMany(models.Actor),{
          onDelete:"cascade"
        }
  };
  Actor.associate = models =>{
    Actor.belongsTo(models.Film),{
      onDelete:"cascade"
    }
};*/
Film.hasMany(Actor);
Actor.belongsTo(Film, { as: 'actors', constraints: false });
/*Actor.belongsTo(Film, {
  foreignKey: "filmId",
  as: "films"
});*/

  (async () => {
    await sequelize.sync({ force: true });
    //const jane = await User.create({ firstName: "Ina" ,lastName:"Karter"});
    //console.log(jane.toJSON());
  })();
module.exports = Film;
