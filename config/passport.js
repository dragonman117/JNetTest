var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db.js');

// Serialize Sessions
passport.serializeUser(function(user, done){
    done(null, user);
});

//Deserialize Sessions
passport.deserializeUser(function(user, done){
    db.User.find({where: {id: user.id}}).then(function(user){
        done(null, user);
    },function(err){
        done(err, null);
    });
});

// For Authentication Purposes
passport.use(new LocalStrategy(
    function(a_num, password, done){
        db.User.find({where: {a_num: a_num}}).then(function(user){
            passwd = user ? user.password : '';
            isMatch = db.User.validPassword(password, passwd, done, user);
        });
    }
));