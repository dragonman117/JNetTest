/**
 * Created by Chris on 3/31/2017.
 */

module.exports = function(app, passport) {
    /**
     * gets a single test case, usually this function is used with  a list of other test cases to produce an array.
     */
    app.get('/test_case/:id', function (req, res, next) {
        /**
         * {
         *   "input" : input,
         *   "expected_output" : expected_output,
         * }
         */
    });

    /**
     * Creates an empty test case that takes parameter 'question_id'
     */
    app.get('/create/exam/:e_id/question/:q_id/test_case', function(req, res, next){
        //create new question
        //attach exam to question and vice versa
        //refresh page
        db.TestCase.create({
            question_id: req.params['q_id'],
            expected_output: ''
        }).then(function(test_case){
            res.redirect('/edit/exam/'+req.params['e_id']+'/question/'+req.params['q_id']);
        })
    });

    /**
     * Edits a test cases attributes:
     * input, expected_output
     */
    app.post('/edit/exam/:e_id/question/:q_id/test_case/:id', function (req, res, next) {
        //change test_case info
        //test_case = database.getTestCase(req.params['id']);
        let test_case = req.body;
        db.TestCase.update(test_case, {where: {id: req.params['id']}}).then(function (test_case) {
            res.redirect('/edit/exam/'+req.params['e_id']+'/question/'+req.params['q_id']);
        });
    });

    /**
     * First dereferences a test case from all its questions,
     * then deletes the test case
     */
    app.get('/delete/exam/:e_id/question/:q_id/test_case/:t_id', function (req, res, next) {
        db.TestCase.destroy({where: {id: req.params['t_id']}}).then(function () {
            res.redirect('/edit/exam/'+req.params['e_id']+'/question/'+req.params['q_id']);
        })
    });
};