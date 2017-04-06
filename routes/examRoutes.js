/**
 * Created by Chris on 3/31/2017.
 */

module.exports = function(app, passport) {

    /**
     * Deletes an exam, since questions can be attached to multiple exams, questions should only be deleted if tied to
     * this exam alone. Finally, delete the exam with id
     */
//NEEDS TESTING
    app.get('/data/exam/delete/:id', function (req, res, next) {
        //exam = database.getExam(req.params['id']);
        //dereference class section from this exam
        //dereference questions from this exam, if question is unattached, delete it
        //delete exam
        exam = getExamById(req.params['id']);
        exam.questions.forEach(x => {
            question.test_cases.forEach(y => db.TestCase.destroy(y))
            db.Question.destroy(y);
            db.Exam.destroy(exam);
        });
    });

    /**
     * Since each question is updated individually on the editing page, all this post should do
     * is update basic exam information:
     * Title, open_date, close_date, rule_stmt, time_limit
     */
    app.post('/data/exam/edit/:id', function (req, res, next) {
        //exam = database.getExam(req.params['id']);
        //change exam info
        //refresh page
        exam = req.body;
        db.Exam.update(exam, {where: {id: req.params['id']}}).then(function (exam) {
            res.sendStatus(200);
            res.end();
        });
    });

    /**
     * First creates an exam with basic information passed in:
     * title, open_date, close_date, rules_stmt, time_limit, section_id
     * then it should redirect to the exam editing page
     */
    app.get('/data/exam/create', function (req, res, next) {
        //create exam using basic info
        db.Exam.create({
            title: 'Unititled Exam',
            published: Date(),
            open_date: Date(),
            close_date: Date(),
            rules_stmt: 'Rules for the exam. These will be displayed to the student.',
            time_limit: '60'
        }).then(function (exam) {
            res.redirect('/data/exam/' + exam.id + '/edit');
        });
    });

    /**
     * Big exam editing page, this should give a lot of information:
     * Get the exam information
     * Get all the question information from the exam
     * Get all the test cases from the questions
     */
    app.get('/exam/edit/:id', function (req, res, next) {
        getExamById(req.params["id"]).then(exam =>
        {
            res.render('exam_edit', exam);
        });
    });
};


function getExamById(id){
    return new Promise((resolve, reject) => {
        let exam_data;
        let examPromise = db.Exam.findById(id);
        var questionsPromise = db.Question.findAll({where: {exam_id: id}})
        Promise.all([examPromise, questionsPromise]).then(function (results) {
            let exam = JSON.parse(JSON.stringify(results[0]));
            let questions = results[1];
            let testCasePromises = [];
            questions.forEach(i => {
                let promise = db.TestCase.findAll({where: {question_id: i.id}});
                testCasePromises.push(promise);
            });
            Promise.all(testCasePromises).then(testCases => {
                for (let i = 0; i < testCases.length; i++) {
                    questions[i]['dataValues']['test_cases'] = JSON.parse(JSON.stringify(testCases[i]))
                }
                exam_data = exam;
                exam_data['questions'] = questions;
                resolve(exam_data);
            });
        });
    });
};