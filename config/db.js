var Sequelize = require('sequelize');
/* //This is more for production
var sequelize = new Sequelize('nodeTest','root','',{
    'host': '127.0.0.1',
    'dialect':'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});
*/
var sequelize = new Sequelize('nodeTest', 'root','',{
    'host': 'localhost',
    'dialect': 'sqlite',
    'pool': {
        max: 10,
        min: 0,
        idle: 10000
    },
    'storage': './database/database.sqlite'
});

var db = {
    'Sequelize': Sequelize,
    'sequelize':sequelize
};

//Import Models
db.User = sequelize.import('../models/User.js');

//Relationships


module.exports = db;