

module.exports = {
    getExamById: function(id){
        return new Promise((resolve, reject) => {
            let exam_data;
            let examPromise = db.Exam.findById(id);
            var questionsPromise = db.Question.findAll({where: {exam_id: id}});
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
    },
};