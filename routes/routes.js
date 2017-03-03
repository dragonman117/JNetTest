//Get Lang
lang = require("../lang/lang.eng.js");

hbs = require('hbs');
hbs.registerPartials(__dirname + '/../views/partials');

var fakedb = [
    {
        name:"CS1400",
        sections:['Exam 0', 'Exam 1','Exam 2']
    },

    {
        name:"MATH2200",
        sections:['Pretest', 'Midterm 1', 'Midterm 2', 'Final']
    },

    {
        name: "DEATH2250",
        sections: []
    }
];

module.exports = function(app, passport) {
    app.get('/', function(req,res){
        res.redirect(303, '/section/all');
    });
    app.get('/section', function(req,res){
        res.redirect(303, '/section/all');
    });

    app.get('/section/:id', function(req,res){
        let results = {};
        //replace this with 2 cases (section in database, or not) and database calls to get data
        results["classSections"] = ['CS1400', 'MATH2200','DEATH2250'];
        if (req.params.id == 'CS1400'){
            results["db"] =  [{name: "CS1400", sections: ['Exam 0', 'Exam 1', 'Exam 2']}];
        }
        else if (req.params.id == 'MATH2200') {
            results["db"] = [{name: "MATH2200", sections: ['Pretest', 'Midterm 1', 'Midterm 2', 'Final']}];
        }
        else if (req.params.id == 'DEATH2250') {
            results["db"] = [{name: "DEATH2250", sections: []}];
        }
        else {
            results["db"] = fakedb;
        }
        res.render('exam_list_instructor', results);
    });

    app.post('/signup', function(req, res, next){
        console.log(req.body);
        app.db.User.find({where:{a_num: req.body.a_num}}).then(function(user){
            if(!user){
                app.db.User.create({a_num: req.body.a_num, password: req.body.password}).error(function(err){
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
        res.redirect(303, '/');
    });

    app.get('/userInfo', isLoggedIn, function(req, res, next){
        let user = req.session.passport.user;
        delete user.password;
        res.json(user);
    });

    app.get('/error', function(req, res, next){
        //hide this for production
        let response = {
            hasError: true,
            errMessage: lang.loginErr
        };
        res.json(response);
    });

    app.get('/notAuthorised',function(req, res, next){
        res.json({hasError: true, message:lang.notAuth});
    });

    app.get('/*',function(req,res){
        res.redirect(303, "/")
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