/**
 * TODO for Routes:
 * post('login') should connect to database, leave a cookie so user stays logged in
 *
 * posts for these:
 * /data/exam/create
 * DONE /data/exam/edit/:id
 * /data/exam/delete/:id
 * /data/question/create
 * /data/question/edit/:id
 * /data/question/delete/:id
 * /data/t_case/create
 * /data/t_case/edit/:id
 * /data/t_case/delete/:id
 * 
 * gets for these:
 * /data/class_section/:id
 * NEEDS CALL TO HBS /data/exam/edit/:id
 * /data/question/edit/:id
 * /data/t_case/edit/:id
 */


//Get Lang
lang = require("../lang/lang.eng.js");
db = require("../config/db.js");

hbs = require('hbs');
hbs.registerPartials(__dirname + '/../views/partials');


module.exports = function(app, passport) {
      res.redirect('/dashboard');
    });

    app.post('/signup', function (req, res, next) {
        //console.log(req.body);
        app.db.User.find({where: {username: req.body.username}}).then(function (user) {
            if (!user) {
                app.db.User.create({
                    username: req.body.username,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                }).error(function (err) {
                    console.log(err);
                });
                res.redirect("/login");
            } else {
                res.json({status: "user exists in db"});
            }
        }, function (e) {
            console.log("WE HAD AN ERROR");
            console.log(e);
        });
    });

    app.get('/signup', function(req, res, next){
        res.render('signup');
    })

    app.get('/login', function(req, res, next){
        res.render('login');
    });

    app.post('/login', passport.authenticate('local',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/error' // redirect back to the signup page if there is an error
    }));

    app.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/login');
        //console.log(req.session);
        //res.json({status:'logout', sucess:true});
    });

    app.get('/userInfo', isLoggedIn, function (req, res, next) {
        let user = req.session.passport.user;
        delete user.password;
        res.json(user);
    });

    app.get('/notAuthorised',function(req, res, next){
        res.json({hasError: true, message:lang.notAuth});
    });

    app.get('/error', function(req, res, next){
        let response = {
            hasError: true,
            errMessage: lang.loginErr
        };
        res.json(response);
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/notAuthorised');
};
