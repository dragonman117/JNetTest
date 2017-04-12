/**
 * Created by timothyferrell on 4/2/17.
 */

$("#compile").on("click", function (e) {
    let content = editor.getValue();
    $("#resultsOpen").css("display", "none");
    $("#console").css("display", "block");
    $("#compile-body").html("Compiling ... ");
    $.post("/exam/compile",{'code':content}, function (data) {
        console.log(data);
        if(data.errorLog === ""){
            let result = "Compilation Success: " + data.runTime.trim() + " sec \n" + data.stdout;
            $("#compile-body").html(result);
        } else {
            let result = "Compilation Failed: " + data.runTime.trim() + " sec \n" + data.errorLog;
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

