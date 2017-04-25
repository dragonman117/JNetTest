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

    app.post('/data/section/create', function(req, res, next){
        app.db.Section.find({where: {name: req.body.name}}).then(function (sect) {
            if (!sect) {
                app.db.Section.create({
                    name: req.body.name,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date

                }).error(function (err) {
                    console.log(err);
                });
                res.json({status: "Section created"})
            } else {
                res.json({status: "Section exists in db"});
            }
        }, function (e) {
            console.log("WE HAD AN ERROR");
            console.log(e);
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