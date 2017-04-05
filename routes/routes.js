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
    app.get('/', function(req,res){
      res.render('main_with_sidebar', {classSections:['CS1400', 'MATH2200','DEATH2250']});
      //res.json({status:"found home"});
    });

    app.get('/dashboard', function(req, res){
        //console.log(req.session.user.username);
        res.render('main_with_sidebar', {username: req.session.passport.user.username, classSections:['CS1400', 'MATH2200','DEATH2250']})
    })

    app.post('/signup', function(req, res, next){
        console.log(req.body);
        app.db.User.find({where:{username: req.body.username}}).then(function(user){
            if(!user){
                app.db.User.create({username: req.body.username, password: req.body.password, first_name: req.body.first_name, last_name: req.body.last_name}).error(function(err){
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

    app.get('/login', function(req, res, next){
        res.render('login');
    });

    app.post('/login', passport.authenticate('local',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/error' // redirect back to the signup page if there is an error
    }));

    app.get('/logout', function(req, res, next){
        req.logout();
        console.log(req.session);
        res.json({status:'logout', sucess:true});
    });

    app.get('/userInfo', isLoggedIn, function(req, res, next){
        let user = req.session.passport.user;
        delete user.password;
        res.json(user);
    });


    /**
     * Big exam editing page, this should give a lot of information:
     * Get the exam information
     * Get all the question information from the exam
     * Get all the test cases from the questions
     */
    app.get('/data/exam/:id/edit', function(req, res, next){
        console.log('Received request for exam edit.');
        var exam_data;
        let examPromise = db.Exam.findById(req.params['id']);
        var questionsPromise = db.Question.findAll({where: {exam_id: 1}})
        Promise.all([examPromise, questionsPromise]).then(function(results){
            let exam = results[0];
            let questions = results[1];
            let testCasePromises = [];
            questions.forEach(i => {
                let promise = db.TestCase.findAll({where:{question_id: i.id}});
                testCasePromises.push(promise);
            });
            Promise.all(testCasePromises).then(testCases => {
                for(let i = 0; i < testCases.length; i++) {
                    questions[i]['test_cases'] = testCases[i]
                }
                /////////////////////////////////////////////////////////
                //COMPILE TEMPLATE WITH EXAM OBJECT AND SEND TO CLIENT //
                /////////////////////////////////////////////////////////
            });
            exam_data = exam;
            exam_data['questions'] = questions;

            /*
            exam_data = {
                "id": exam.id,
                "exam_title": exam.title,
                "open_date": exam.open_date,
                "close_date": exam.close_date,
                "rules_stmt": exam.rules_stmt,
                "time_limit": exam.time_limit,
                "section_id": exam.section_id,

                "questions":[
                    Should contain all question objects in here, example question info:
            {
                "id" : id,
                "prompt" : prompt,
                "graphic" : graphic,
                "starter_code" : starter_code,
                "average_score" : average_score,
                "rubric" : rubric
                "pts_test_case" : pts_test_case,
                "pts_graded" : pts_graded

                "test_cases":[
                contains all test cases, example:
                {
                    "id": id,
                    "input" : input,
                    "expected_output" : expected_output
                },
            ]
            },

            ]
        }
        */
        });
    });

    /**
     * Gets a single questions information, mainly with a list of other questions that produce an array of lists
     * MAY NOT BE NEEDED
     */

    app.get('/data/question/:id', function(req,res,next){
        promises = [
            db.Question.findById(req.params['id']),
            db.TestCase.findAll({where: {question_id: req.params['id']}}),
            ]

        Promise.all(promises).then(function(results) {
            let question = results[0];
            question.dataValues['test_cases'] = results[1]
            res.send(JSON.stringify(question));
        });
         /**
         {
            "id" : id,
            "prompt" : prompt,
            "graphic" : graphic,
            "starter_code" : starter_code,
            "average_score" : average_score,
            "rubric" : rubric
            "pts_test_case" : pts_test_case,
            "pts_graded" : pts_graded

            "test_cases":[
               contains all test cases, example:
               {
               "input" : input,
               "expected_output" : expected_output
             ]
         }
         **/
    });

    /**
     * gets a single test case, usually this function is used with  a list of other test cases to produce an array.
     * ALMOST CERTAINLY NOT NEEDED
    */
    app.get('/data/t_case/:id', function(req, res, next){
        /**
         * {
         *   "input" : input,
         *   "expected_output" : expected_output,
         * }
         */




    });

    /**
     * First creates an exam with basic information passed in:
     * title, open_date, close_date, rules_stmt, time_limit, section_id
     * then it should redirect to the exam editing page
     */
    app.post('/data/exam/create', function(req, res, next){
        //create exam using basic info
        db.Exam.Create({
            title: 'Unititled Exam',
            published: Date(),
            open_date: Date(),
            close_date: Date(),
            rules_stmt: 'Rules for the exam. These will be displayed to the student.',
            time_limit: '60'
        }).then(fucntion({
            //Redirect to Exam Edit page.
        }));
        //res.render('/data/exam/' + id_num)
    });

    /**
     * Since each question is updated individually on the editing page, all this post should do
     * is update basic exam information:
     * Title, open_date, close_date, rule_stmt, time_limit
     */
    app.post('/data/exam/edit/:id', function(req, res, next){
        //exam = database.getExam(req.params['id']);
        //change exam info
        //refresh page
        exam = req.body;
        db.Exam.update(exam, {where: {id: req.params['id']}});
        res.sendStatus(200);
        res.end();
        //REFRESH PAGE?
    });

    /**
     * Deletes an exam, since questions can be attached to multiple exams, questions should only be deleted if tied to
     * this exam alone. Finally, delete the exam with id
     */
    app.post('/data/exam/delete/:id', function(req, res, next){
        //exam = database.getExam(req.params['id']);
        //dereference class section from this exam
        //dereference questions from this exam, if question is unattached, delete it
        //delete exam
    });

    /**
     * Creates an empty question that takes exam_id as input:
     */
    app.post('/data/question/create', function(req, res, next){
        //create new question
        //attach exam to question and vice versa
        //refresh page
    });

    /**
     * Updates a question with new information:
     * prompt, graphic, starter_code, average_score, pts_test_cast, pts_graded
     */
    app.post('/data/question/edit/:id', function(req, res, next){
        //question = database.getQuestion(req.params['id']);
        //update question with new info from req
    });

    /**
     * First dereferences a question from all the exams it is in,
     * then dereferences from test cases
     * Then deletes the question
     */
    app.post('/data/question/delete/:id', function(req, res, next){
        //question = database.getQuestion(req.params['id']);
        //dereference question from all exams and vice versa
        //dereference test cases, if test case has no more questions attached, delete it too
        //delete question
    });

    /**
     * Creates an empty test case that takes parameter 'question_id'
     */
    app.post('/data/t_case/create', function(req, res, next){
        //create test case
        //attach test case to req.question_id and vice versa
        //refresh page
    });

    /**
     * Edits a test cases attributes:
     * input, expected_output
     */
    app.post('/data/t_case/edit/:id', function(req, res, next){
        //test_case = database.getTestCase(req.params['id']);
        //change test_case info
        //referesh page
    });

    /**
     * First dereferences a test case from all its questions,
     * then deletes the test case
     */
    app.post('/data/t_case/delete/:id', function(req, res, next){
        //test_case = database.getTestCase(req.params['id']);
        //dereference questions from test case and vice versa
        //delete test case
    });




    app.get('/error', function(req, res, next){
        let response = {
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
