import test from 'ava';
import Compilation from '../lib/dockerSystem';


//Create Tests Data Objects

//Test basic hello world
let test0Obj =  {
    rootpath: "/Users/timothyferrell/WebstormProjects/JNetTest",
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
    rootpath: "/Users/timothyferrell/WebstormProjects/JNetTest",
    folder: "tstFolder",
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
    rootpath: "/Users/timothyferrell/WebstormProjects/JNetTest",
    folder: "tstFolder",
    fileName: "main.cpp",
    code: "#include <iostream> \n#include <unistd.h>\n\nusing namespace std;\n\nint main(){ \n    while(1){\n        fork();\n    }\n    return 0;\n}",
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