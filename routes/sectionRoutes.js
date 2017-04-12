/**
 * Created by Chris on 4/10/2017.
 */

module.exports = function(app, passport) {

    //Renders exam list view with Sections and Exams pertaining to a user.
    //Likely needs renamed
    app.get('/sections/:user_id', function(req, res, next) {
        db.UserSection.findAll({where: {user_id: req.params['user_id']}})
            .then(results => {
                let promises = [];
                results.forEach(result => {
                    promises.push(
                        db.Section.findById(result['section_id'], {include: [{model: db.Exam}]})
                    );
                });
                Promise.all(promises).then(sections => {
                    res.send(sections);
                });
            });
    });

    app.get('/data/section/delete/:id', function(req,res,next){
        db.Section.findById(
            req.params['id'],
            {include: [{model: db.Exam, include: [{model: db.Question}]}]}
            )
        .then(function(section) {
            section.Exams.forEach(exam => {
                exam.Questions.forEach(question =>{
                    db.TestCase.destroy({where: {question_id: question.id}});
                    db.Question.destroy({where: {id: question.id}});
                });
                db.Exam.destroy({where: {id: exam.id}})
            });
            db.Section.destroy({where: {id: req.params['id']}});
        });
        res.sendStatus(200);
        res.end();
    });
};