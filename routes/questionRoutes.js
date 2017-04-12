/**
 * Created by Chris on 3/31/2017.
 */
require('./testCaseRoutes');
module.exports = function(app, passport){
    /**
     * Gets a single question's information, mainly with a list of other questions that produce an array of lists
     */
    app.get('/data/question/edit/:id', function(req,res,next){
        promises = [
            db.Question.findById(req.params['id']),
            db.TestCase.findAll({where: {question_id: req.params['id']}}),
        ];

        Promise.all(promises).then(function(results) {
            let question = results[0];
            question.dataValues['test_cases'] = results[1]
            //res.send(JSON.stringify(question));
            res.render("question_editor", question.dataValues);
        });
    });

    /**
     * Creates an empty question that takes exam_id as input:
     */
    app.get('/data/question/create/:exam_id', function(req, res, next){
        //create new question
        //attach exam to question and vice versa
        //refresh page
        db.Question.create({
            exam_id: req.params['exam_id']
        }).then(function(question){
            res.send(question);
            res.end();
        })
    });

    /**
     * Updates a question with new information:
     * prompt, graphic, starter_code, average_score, pts_test_cast, pts_graded
     */
    app.post('/data/question/edit/:id', function(req, res, next){
        //question = database.getQuestion(req.params['id']);
        //update question with new info from req
        question = req.body;
        db.Question.update(question, {where: {id: req.params['id']}}).then(function(question){
            res.sendStatus(200);
            res.end();
        });
    });

    /**
     * First dereferences a question from all the exams it is in,
     * then dereferences from test cases
     * Then deletes the question
     */
    app.get('/data/question/delete/:id', function(req, res, next){
            db.TestCase.destroy({where: {question_id: req.params['id']}});
            db.Question.destroy({where: {id: req.params['id']}});
            res.sendStatus(200)
            res.end()
        });

        /*
        db.Question.destroy({where: {id: req.params['id']}}).then(function(){
            res.sendStatus(200);
            res.end();
        });
        */
};