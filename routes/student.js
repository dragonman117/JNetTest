let auth = require("../middleware/auth.mid");
let view = require("../middleware/view.mid");
let sysConfig = require("../config/sysConfig.json");

let docker = require("../lib/dockerSystem");

module.exports = function (app, passport) {
    app.get("/exam/take", auth.isLoggedIn, view.getGlobals, function (req, res) {
        res.render("student_take_test.hbs", req.viewData);
    });

    app.post("/exam/compile", auth.isLoggedIn, view.getGlobals, function (req, res) {
        let compileObj =  {
            rootpath: sysConfig.docker_rootpath,
            folder: req.session.id,
            fileName: "main.cpp",
            code: req.body.code,
            langName: "C++",
            stdinData: "",
            vmName: "code-compiler",
            compilerName: "\'g++ -o /usercode/a.out\' ",
            outputCommand: "/usercode/a.out",
            extraArguments: ""
        };
        let compile = new docker(compileObj);
        compile.run().then(function (result) {
            res.json(result);
        });
    });

    app.get('/dashboard/:s_id', auth.isLoggedIn, view.getGlobals, function(req, res){
        db.UserSection.findAll({where: {user_id: req.viewData.user.id}})
            .then(results => {
                let promises = [];
                results.forEach(result => {
                    promises.push(
                        db.Section.findById(result['section_id'], {include: [{model: db.Exam}]})
                    );
                });
                Promise.all(promises).then(sections => {
                    //res.send(sections);
                    //console.log("Test");
                    //console.log(sections[0].dataValues);
                    //console.log(sections[0].dataValues.name);
                    //console.log(sections[0].dataValues);

                    req.viewData.classSections = sections;
                    req.viewData.filter_sections = sections.filter(function(obj){
                        console.log("URL ID: " + req.params['s_id']);
                        console.log("Section ID: " + obj.id);
                        return obj.id == req.params['s_id'];
                    });
                    console.log(req.viewData.classSections);
                    //req.viewData.testList = ;
                    res.render("student_dashboard", req.viewData);
                    //console.log(req.viewData.classSections[0].dataValues.name);
                });
            });

    })


    app.get("/dashboard", auth.isLoggedIn, view.getGlobals, function(req, res){
       // let testList = ["Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test"];
       // req.viewData.tests= testList;

        //get sections list
        db.UserSection.findAll({where: {user_id: req.viewData.user.id}})
            .then(results => {
                let promises = [];
                results.forEach(result => {
                    promises.push(
                        db.Section.findById(result['section_id'], {include: [{model: db.Exam}]})
                    );
                });
                Promise.all(promises).then(sections => {
                    //res.send(sections);
                    //console.log("Test");
                    //console.log(sections[0].dataValues);
                    //console.log(sections[0].dataValues.name);
                    //console.log(sections[0].dataValues);
                    let sect = sections;
                    req.viewData.classSections = sect;
                    req.viewData.filter_sections = sect;
                    //console.log(req.viewData.filterSections);

                    res.render("student_dashboard", req.viewData);
                    //console.log(req.viewData.classSections[0].dataValues.name);
                });
            });



        //res.render('main_with_sidebar', {username: req.session.passport.user.username, classSections:['CS1400', 'MATH2200','DEATH2250']})
    });
};