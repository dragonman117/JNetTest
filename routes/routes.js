//Get Lang
lang = require("../lang/lang.eng.js");

hbs = require('hbs');
hbs.registerPartials(__dirname + '/../views/partials');


module.exports = function(app, passport) {
    app.get('/', function(req,res){
        res.render('main_with_sidebar', {classSections:['CS1400', 'MATH2200','DEATH2250']});
        //res.json({status:"found home"});
    });

    app.post('/signup', function(req, res, next){
        console.log(req.body);
        app.db.User.find({where:{username: req.body.username}}).then(function(user){
            if(!user){
                app.db.User.create({username: req.body.username, password: req.body.password}).error(function(err){
                    console.log(err);
                });
                res.json({status:"user created"})
            } else {
                res.json({status:"user exists in db"});
            }
        },function(e){
            console.log("WE HAD AN ERROR");
            console.log(e);
        });
    });

    app.post('/login', passport.authenticate('local',{
        successRedirect : '/userInfo', // redirect to the secure profile section
        failureRedirect : '/error' // redirect back to the signup page if there is an error
    }));

    app.get('/logout', function(req, res, next){
        req.logout();
        console.log(req.session);
        res.json({status:'logout', sucess:true});
    });

    app.get('/userInfo', isLoggedIn, function(req, res, next){
        var user = req.session.passport.user;
        delete user.password;
        res.json(user);
    });

    app.get('/error', function(req, res, next){
        var response = {
            hasError: true,
            errMessage: lang.loginErr
        };
        res.json(response);
    });

    app.get('/notAuthorised',function(req, res, next){
        res.json({hasError: true, message:lang.notAuth});
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/notAuthorised');
}