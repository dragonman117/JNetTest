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
        // x parameter marked as unused
        exam.questions.forEach(x => {
            question.test_cases.forEach(y => db.TestCase.destroy(y));
            db.Question.destroy(y);
            db.Exam.destroy(exam);
        });
    });

    /**
     * Since each question is updated individually on the editing page, all this post should do
     * is update basic exam information:
     * Title, open_date, close_date, rule_stmt, time_limit
     */
    app.post('/exam/edit/:id', function (req, res, next) {
        //exam = database.getExam(req.params['id']);
        //change exam info
        //refresh page
        exam = req.body;
        console.log(exam);
        db.Exam.update(exam, {where: {id: req.params['id']}}).then(function (exam) {
            res.redirect('/exam/edit/' + req.params['id'])
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
            //these field can, and probably should, be left blank. form has prompt text already included.
            title: 'Unititled Exam',
            published: false
        }).then(function (exam) {
            res.redirect('/exam/edit/' + exam.id);
        });
    });

    /**
     * Big exam editing page, this should give a lot of information:
     * Get the exam information
     * Get all the question information from the exam
     * Get all the test cases from the questions
     */
    app.get('/exam/edit/:id', function (req, res, next) {
        console.log('Received request for exam edit.');
        getExamById(req.params["id"]).then(function (data) {
            console.log(data);
            res.render('exam_edit', data);
        })
    });
};

function getExamById(id){
    return new Promise((resolve, reject)=>{
        let exam_data;
        let examPromise = db.Exam.findById(id);
        let questionsPromise = db.Question.findAll({where: {exam_id: 1}});
        Promise.all([examPromise, questionsPromise]).then(function(results){
            //console.log(JSON.parse(JSON.stringify(results)));
            let exam = JSON.parse(JSON.stringify(results))[0];
            let questions = JSON.parse(JSON.stringify(results))[1];
            let testCasePromises = [];
            questions.forEach(i => {
                let promise = db.TestCase.findAll({where:{question_id: i.id}});
                testCasePromises.push(promise);
            });
            Promise.all(testCasePromises).then(testCases => {
                for(let i = 0; i < testCases.length; i++) {
                    questions[i]['test_cases'] = testCases[i]
                }
                exam_data = exam;
                exam_data['questions'] = questions;
                resolve(exam_data);
            });
        });
    })
}