/**
 * Created by Chris on 3/31/2017.
 */

module.exports = function(app, passport){
    /**
     * gets a single test case, usually this function is used with  a list of other test cases to produce an array.
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
     * Creates an empty test case that takes parameter 'question_id'
     */
    app.get('/data/test_case/create', function(req, res, next){
        db.TestCase.create({
            exam_id: req.question_id
        }).then(function(test_case){
            res.send(test_case);
            res.end();
        });
    });

    /**
     * Edits a test cases attributes:
     * input, expected_output
     */
    app.post('/data/test_case/edit/:id', function(req, res, next){
        //change test_case info
        //test_case = database.getTestCase(req.params['id']);
        let test_case = req.body;
        db.TestCase.update(test_case, {where: {id: req.params['id']}}).then(function(test_case){
            res.sendStatus(200);
            res.end();
        });
    });

    /**
     * First dereferences a test case from all its questions,
     * then deletes the test case
     */
    app.get('/data/t_case/delete/:id', function(req, res, next){
        db.TestCase.destroy({where: {id: req.params['id']}});
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