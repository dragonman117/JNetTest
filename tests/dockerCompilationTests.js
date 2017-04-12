import test from 'ava';
import Compilation from '../lib/dockerSystem';
let sysConfig = require("../config/sysConfig.json");


//Create Tests Data Objects

//Test basic hello world
let test0Obj =  {
    rootpath: sysConfig.docker_rootpath,
    folder: "tstFolder",
    fileName: "main.cpp",
    code: "#include <iostream> \n\nusing namespace std;\n\nint main(){ \n    cout << \"Hello World\" << endl;\n    return 0;\n}",
    langName: "C++",
    stdinData: "",
    vmName: "code-compiler",
    compilerName: "\'g++ -o /usercode/a.out\' ",
    outputCommand: "/usercode/a.out",
    extraArguments: ""
};

//Test infinite Loop
let test1Obj = {
    rootpath: sysConfig.docker_rootpath,
    folder: "tstFolder2",
    fileName: "main.cpp",
    code: "#include <iostream> \n\nusing namespace std;\n\nint main(){ \n    while(true){}\n    return 0;\n}",
    langName: "C++",
    stdinData: "",
    vmName: "code-compiler",
    compilerName: "\'g++ -o /usercode/a.out\' ",
    outputCommand: "/usercode/a.out",
    extraArguments: ""
};

//Fork Bomb loop
let test2Obj = {
    rootpath: sysConfig.docker_rootpath,
    folder: "tstFolder3",
    fileName: "main.cpp",
    code: "#include <iostream> \n#include <unistd.h>\n\nusing namespace std;\n\nint main(){ \n    while(1){\n        fork();\n    }\n    return 0;\n}",
    langName: "C++",
    stdinData: "",
    vmName: "code-compiler",
    compilerName: "\'g++ -o /usercode/a.out\' ",
    outputCommand: "/usercode/a.out",
    extraArguments: ""
};

//Test basic will not compile
let test3Obj =  {
    rootpath: sysConfig.docker_rootpath,
    folder: "tstFolder4",
    fileName: "main.cpp",
    code: "#include <iostream>\n\nint main(){ \n    cout << \"Hello World\" << endl\n    return 0;\n}",
    langName: "C++",
    stdinData: "",
    vmName: "code-compiler",
    compilerName: "\'g++ -o /usercode/a.out\' ",
    outputCommand: "/usercode/a.out",
    extraArguments: ""
};

//Tests

test("Compilation: Basic Hello World Compilation Test", t=>{
    let tmpObj = new Compilation(test0Obj);
    let expectedData = "Hello World\n ";
    let expectedError = "";

    tmpObj.run().then(result=>{
        test.is(result.stdout, expectedData);
        test.is(result.errorLog, expectedError);
    });
});

test("Compilation: Infinite Loop Test", t=>{
   let tmpObj = new Compilation(test1Obj);
   let expectedData = "\nExecution Timed Out";
   let expectedError = "";
   tmpObj.run().then(result=>{
       test.is(result.stdout, expectedData);
       test.is(result.errorLog, expectedError);
   });
});

test("Compilation: Fork Bomb Test", t=>{
    let tmpObj = new Compilation(test2Obj);
    let expectedData = '\nExecution Timed Out';
    let expectedError = "";

    tmpObj.run().then(result=>{
        test.is(result.stdout, expectedData);
        test.is(result.errorLog, expectedError);
    });
});


test("Compilation: Will Not Compile", t=>{
    let tmpObj = new Compilation(test2Obj);
    let expectedData = 'Compilation Failed\n';
    let expectedError = '/usercode/main.cpp: In function \'int main()\':\n/usercode/main.cpp:4:5: error: \'cout\' was not declared in this scope\n     cout << "Hello World" << endl\n     ^\n/usercode/main.cpp:4:5: note: suggested alternative:\nIn file included from /usercode/main.cpp:1:0:\n/usr/include/c++/5/iostream:61:18: note:   \'std::cout\'\n   extern ostream cout;  /// Linked to standard output\n                  ^\n/usercode/main.cpp:4:30: error: \'endl\' was not declared in this scope\n     cout << "Hello World" << endl\n                              ^\n/usercode/main.cpp:4:30: note: suggested alternative:\nIn file included from /usr/include/c++/5/iostream:39:0,\n                 from /usercode/main.cpp:1:\n/usr/include/c++/5/ostream:590:5: note:   \'std::endl\'\n     endl(basic_ostream<_CharT, _Traits>& __os)\n     ^\n';

    tmpObj.run().then(result=>{
        test.is(result.stdout, expectedData);
        test.is(result.errorLog, expectedError);
    });
});