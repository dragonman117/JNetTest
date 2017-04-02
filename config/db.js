var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
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
    'storage': './database/database.sqlt'
});

var db = {
    'Sequelize': Sequelize,
    'sequelize':sequelize
};

var importModels=function() {
    files = fs.readdirSync('./models/');
    files.forEach(file => {
        var infile = path.join('../models', path.basename(file));
        db[path.parse(file).name] = sequelize.import(infile);
    });
}

var buildRelations = function() {
    db.Rubric.hasMany(db.Question, {foreignKey: 'rubric_id'});
    db.Exam.hasMany(db.Question, {foreignKey: 'exam_id'});
    db.Question.hasMany(db.TestCase, {foreignKey: 'question_id'});
    db.Section.hasMany(db.Exam, {foreignKey: 'section_id'});
}

importModels();
buildRelations();

//force: true will delete the tables and make fresh ones.
//use for testing, remove for deployment
db.sequelize.sync({force:true});

module.exports = db;