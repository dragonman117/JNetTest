/**
 * Created by Chris on 3/31/2017.
 */
require('./testCaseRoutes');
module.exports = function(app, passport){
    /**
     * Gets a single question's information, mainly with a list of other questions that produce an array of lists
     */
    app.get('/edit/exam/:eid/question/:qid', function(req,res,next){
        promises = [
            db.Question.findById(req.params['qid']),
            db.TestCase.findAll({where: {question_id: req.params['qid']}}),
        ];

        Promise.all(promises).then(function(results) {
            let question = results[0];
            question.dataValues['test_cases'] = results[1];
            question.exam_id = req.params['eid'];
            question.qid = req.params['qid'];
            //res.send(JSON.stringify(question));
            res.render("question_editor", question.dataValues);
        });
    });

    /**
     * Creates an empty question that takes exam_id as input:
     */
    app.get('/create/exam/:exam_id/question', function(req, res, next){
        //create new question
        //attach exam to question and vice versa
        //refresh page
        db.Question.create({
            exam_id: req.params['exam_id']
        }).then(function(question){
            res.redirect('/edit/exam/'+req.params['exam_id']+'/question/'+question.id);
        })
    });

    /**
     * Updates a question with new information:
     * prompt, graphic, starter_code, average_score, pts_test_cast, pts_graded
     */
    app.post('/edit/exam/:exam_id/question/:q_id', function(req, res, next){
        //question = database.getQuestion(req.params['id']);
        //update question with new info from req
        question = req.body;
        db.Question.update(question, {where: {id: req.params['q_id']}}).then(function(question){
            //console.log(req.body);
            res.redirect('/edit/exam/'+req.params['exam_id']+'/question/'+req.params['q_id']);
        });
    });

    /**
     * First dereferences a question from all the exams it is in,
     * then dereferences from test cases
     * Then deletes the question
     */
    app.get('/delete/exam/:exam_id/question/:q_id', function(req, res, next){
            db.TestCase.destroy({where: {question_id: req.params['q_id']}});
            db.Question.destroy({where: {id: req.params['q_id']}});
        res.redirect('/edit/exam/'+req.params['exam_id']);

    });

        /*
        db.Question.destroy({where: {id: req.params['id']}}).then(function(){
            res.sendStatus(200);
            res.end();
        });
        */
};