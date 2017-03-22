/**
 * Created by Chris on 3/1/2017.
 */

let db = require('../config/db.js');
//import test from 'ava';

var test = function() {
    let retrieved;

    for (let i = 1; i < 10; i++) {
        db.User.create({
            id: i,
            a_num: 'A0178' + i,
            first_name: 'Bob',
            last_name: 'Jones',
            password: 'p@ssw0rd'
        })
    }

    let user = db.User.build({
        id: 101,
        a_num: 'A0184320',
        first_name: 'Juan',
        last_name: 'Snow',
        password: 'herpdy'
    });

    let section = db.Section.build({
        id: 14,
        name: 'BTCH 1010',
        start_date: Date(),
        end_date: Date(),
    });


    let userSection = db.UserSection.build({
        id: 0,
        role: 'INSTRUCTOR',
        user_id: user.id,
        section_id: section.id
    });

    user.save().then(function(){
        section.save().then(function(){
            userSection.save();
        })
    })
}
/*
        then(function(){
            retrieved = (db.User.findAll({where: {id: 0}})).then(function(){
               if(user.a_num === retrieved.a_num){
                   console.log('PASS!')
               }
            });
        });
}
*/
/*
 var test = function(){
 var rubric;
 rubric = db.Rubric.create({
 id: 0,
 data: 'Tada!'
 }).then(function(rubric){
 db.Question.create({
 id: 0,
 prompt: 'Print Hello World! with moveable type.',
 RubricId: 0
 })
 });
 }
 */
db.sequelize.sync({force: true}).then(test);