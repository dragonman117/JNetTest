let auth = require("../middleware/auth.mid");
let view = require("../middleware/view.mid");
let calls = require("../middleware/dbCalls.mid");
let sysConfig = require("../config/sysConfig.json");

let docker = require("../lib/dockerSystem");

module.exports = function (app, passport) {

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

    app.get("/dashboard", auth.isLoggedIn, view.getGlobals, function(req, res){
        let testList = ["Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test"];
        req.viewData.tests= testList;
        res.render("student_dashboard", req.viewData);
        //res.render('main_with_sidebar', {username: req.session.passport.user.username, classSections:['CS1400', 'MATH2200','DEATH2250']})
    });

    app.get("/exam/take/:id",auth.isLoggedIn, view.getGlobals, function (req, res) {
        req.viewData.testId = req.params["id"];
        res.render("student_take_test.hbs", req.viewData);
    });

    app.get("/exam/fetch/:id",auth.isLoggedIn, view.getGlobals, function (req, res) {
        calls.getExamById(req.params['id']).then(exam=>{
            res.json(exam);
        })
    });

    app.post("/exam/submit/:id", auth.isLoggedIn, view.getGlobals, function (req, res) {
        let examProm = db.Exam.findById(req.params.id);
        let userProm = db.User.findById(req.session.passport.user.id);
        Promise.all([examProm, userProm]).then(function (res1) {
            //Create the submision ...
            db.Submission.create({date_submitted:Date.now()}).then(function (sub) {
                res1[1].addSubmission(sub);
                res1[0].addSubmission(sub);
                let data = JSON.parse(req.body.submission);
                let dataSize = data.length;
                let promises = [];
                //create responses
                for(let i = 0; i < dataSize; i++){
                    let tmp = db.Response.create({data:data[i].response});
                    promises.push(tmp);
                }
                //find questions
                for(let i=0; i < dataSize; i++){
                    let tmp = db.Question.findById(data[i].question_id);
                    promises.push(tmp);
                }
                Promise.all(promises).then(function (res2) {
                    //associate the responses...
                    for(let i = 0; i < dataSize; i++){
                        sub.addResponse(res2[i]);
                        res2[i+dataSize].addResponse(res2[i]);
                    }
                    res.json({"sucess":true})
                })
            })
        })

    })

    // app.get("/exam/take", auth.isLoggedIn, view.getGlobals, function (req, res) {
    //     res.render("student_take_test.hbs", req.viewData);
    // });
};