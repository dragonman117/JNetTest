/**
 * Created by timothyferrell on 4/2/17.
 */

let testData = NaN;
let currentIndex = 0;

let next = true;
let prev = true;

let submission = [];

let dialog = document.querySelector('dialog');

$("#compile").on("click", function (e) {
    let content = editor.getValue();
    $("#resultsOpen").css("display", "none");
    $("#console").css("display", "block");
    $("#compile-body").html("Compiling ... ");
    $.post("/exam/compile",{'code':content}, function (data) {
        console.log(data);
        let result = "";
        if(data.errorLog === ""){
            if(typeof(data.runTime) === "string"){
                result = "Compilation Success: " + data.runTime.trim() + " sec \n" + data.stdout;
            }else{
                result = "Compilation Success: " + data.runTime + " sec \n" + data.stdout;
            }
            $("#compile-body").html(result);
        } else {
            //let result = "Compilation Failed: " + data.runTime.trim() + " sec \n" + data.errorLog;
            if(typeof(data.runTime) === "string"){
                result = "Compilation Failed: " + data.runTime.trim() + " sec \n" + data.errorLog;
            }else{
                result = "Compilation Failed: " + data.runTime + " sec \n" + data.errorLog;
            }
            $("#compile-body").html(result);
        }
    }, 'json')
});

$("#consoleOpen").on("click",function (e) {
    $("#resultsOpen").css("display", "none");
    $("#console").css("display", "block");
});

$("#consoleClose").on("click",function (e) {
    $("#console").css("display", "none");
    $("#resultsOpen").css("display", "block");
});
$("#prev").on("click", function (e) {
    submission[currentIndex].response = editor.getValue();
    if((currentIndex - 1) >= 0) currentIndex -= 1;
    displayQuestion(currentIndex);
    e.preventDefault();
});
$("#nxt").on("click", function (e) {
    submission[currentIndex].response = editor.getValue();
    if((currentIndex+1) < testData.questions.length) currentIndex += 1;
    displayQuestion(currentIndex);
    e.preventDefault();
});


$("#sub").on("click", function (e) {
    submission[currentIndex].response = editor.getValue();
    dialog.showModal();
    $.post("/exam/submit/" + testId, {"submission":JSON.stringify(submission)}, function (data) {
        if(data.hasOwnProperty("sucess")){
            $("#waiting").addClass("hidden");
            $("#finished").removeClass("hidden");
            $("#cont").removeAttr("disabled");
        }
    });
    e.preventDefault();
});

function loadTest(){
    return new Promise((res,reject)=>{
        $.get("/exam/fetch/"+testId, function (data) {
            testData = data;
            res();
        })
    })
}

function displayQuestion(id){
    if(id >= 0 && id < testData.questions.length){
        let question = testData.questions[id];
        $("#qTitle").html("Question: " + (id +1));
        $("#qBody").html(question.prompt);
        let starter = question.starter_code;
        if(submission[id].response !== "") starter = submission[id].response;
        if(starter === "" || !starter){
            starter = "#include<iostream>\n\nusing namespace std;\n\nint main(){\n    cout << \"Hello World\"<< endl;\n    return 0;\n}"
        }
        editor.setValue(starter);
        if(id === 0){
            prev = false;
            $("#prev").attr("disabled","");
        }
        else if(!prev){
            $("#prev").removeAttr("disabled")
        }
        if(id === (testData.questions.length-1)){
            $("#nxt").addClass("hidden");
            next = false;
            $("#sub").removeClass("hidden");
        }else if(!next){
            $("#nxt").removeClass("hidden");
            $("#sub").addClass("hidden");
            next = true;
        }
    }else{
        console.log("Error: Question out of range!");
    }
}

$(document).ready(function () {
    loadTest().then(function () {
        //Prep the submission data
        for(let i = 0; i < testData.questions.length; i++ ){
            submission.push({
                question_id: testData.questions[i].id,
                response: ""
            });
        }
        //Finish up load first question...
        $(".loader").addClass("hidden");
        $(".body").removeClass("hidden");
        displayQuestion(currentIndex);
        console.log(submission);
    })
});