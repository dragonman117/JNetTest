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

    app.get("/dashboard", auth.isLoggedIn, view.getGlobals, function(req, res){
        let testList = ["Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test", "Dummy Test"];
        req.viewData.tests= testList;
        res.render("student_dashboard", req.viewData);
    });
};