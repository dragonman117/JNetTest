/**
 * Created by timothyferrell on 2/21/17.
 *
 * Based on Compilebox (updated, integrated, and expanded to work for more general systems ie. win32)
 */

module.exports = class Compiler{

    /**
     * Creates a new compiler instance (with individual docker container)
     * @param obj = Definition object, all parameters are optoinal and in this order {timeout, rootpath, folder, vmName, compilerName, fileName, code, outputCommand, langName, extraArguments, stdinData}
     */
    constructor(obj){
        if(obj.hasOwnProperty("timeout")){
            this.timeout = obj.timeout
        }else{
            this.timeout = 3000;
        }
        if(obj.hasOwnProperty("rootpath")){
            this.rootpath = obj.rootpath;
        }else{
            this.rootpath = "";
        }
        if(obj.hasOwnProperty("folder")){
            this.folder = obj.folder;
        }else{
            this.folder = "";
        }
        if(obj.hasOwnProperty("vmName")){
            this.vmName = obj.vmName;
        }else{
            this.vmName = "";
        }
        if(obj.hasOwnProperty("compilerName")){
            this.compilerName = obj.compilerName;
        }else{
            this.compilerName = "";
        }
        if(obj.hasOwnProperty("fileName")){
            this.fileName = obj.fileName;
        }else{
            this.fileName = "";
        }
        if(obj.hasOwnProperty("code")){
            this.code = obj.code;
        }else{
            this.code = "";
        }
        if(obj.hasOwnProperty("outputCommand")){
            this.outputCommand = obj.outputCommand;
        }else{
            this.outputCommand = "";
        }
        if(obj.hasOwnProperty("langName")){
            this.langName = obj.langName;
        }else{
            this.langName = "";
        }
        if(obj.hasOwnProperty("extraArguments")){
            this.extraArguments = obj.extraArguments;
        }else{
            this.extraArguments = "";
        }
        if(obj.hasOwnProperty("stdinData")){
            this.stdinData = obj.stdinData;
        }else{
            this.stdinData = "";
        }
    }

    //modified to work with promises...
    run(){
        let sandbox = this;
        return new Promise(function (resolve, reject) {
            sandbox.prepare(function () {
                sandbox.execute(resolve);
            })
        })
    }

    prepare(success){
        let exec = require('child_process').exec;
        let fs = require('fs');
        let os = require('os');
        let sandbox = this;
        let isWin = /^win*/.test(os.platform());

        let directory = "";
        let writeCode = "";
        let codePermissions = "";
        let inputFile = "";
        let scriptFile = "";
        if(isWin){
            console.log("comming soon!!!!");
        }else{
            directory = "mkdir " + this.rootpath + "/sandbox/" + this.folder +
                " && cp " + this.rootpath + "/dockerScripts/* " + this.rootpath +"/sandbox/" + this.folder +
                " && chmod 777 " + this.rootpath + "/sandbox/" + this.folder ;
            writeCode = this.rootpath + "/sandbox/" + this.folder + "/" + this.fileName;
            codePermissions = "chmod 777 \'" + this.rootpath + "/sandbox/" + this.folder + this.fileName + "\'";
            inputFile = this.rootpath + "/sandbox/" + this.folder + "/inputFile";
        }

        exec(directory, function () {
            fs.writeFile(writeCode, sandbox.code, function (err) {
                if(err) console.log(err);
                else{
                    exec(codePermissions);

                    fs.writeFile(inputFile, sandbox.stdinData, function (err) {
                        if(err) console.log(err);
                        else{
                            success();
                        }
                    })
                }
            } )
        });
    }

    execute(success){
        let exec = require('child_process').exec;
        let fs = require('fs');
        let os = require('os');
        let sandbox = this;
        let isWin = /^win*/.test(os.platform());

        let cmd = 'docker run -d -t -i -v '+ this.rootpath + '/sandbox/' + this.folder +
            ':/usercode ' + this.vmName + ' /usercode/genScript.sh ' + this.compilerName + ' ' + this.fileName + ' ' +
            this.outputCommand + ' ' + this.extraArguments;
        let completedFile = "";
        let errorFile = "";
        let logFile = "";
        if(isWin){
            console.log("comming soon!!!");
        }else{
            completedFile = this.rootpath + "/sandbox/" + this.folder + "/completed";
            errorFile = this.rootpath + "/sandbox/" + this.folder + "/errors";
            logFile = this.rootpath + "/sandbox/" + this.folder + "/logfile.txt";
        }

        let container = "";
        let killCmd = 'docker kill ';
        let stop = 'docker stop ';
        let removeContainer = "docker rm -f ";
        exec(cmd, function(error, stdout, stderr){
            //set the docker container kill cmd
            if(!stderr && !error){
                // No errors run code below
                container = stdout;
                killCmd += container;
                removeContainer += container;
                stop += container;

                let cont = true;
                let timeout = false;

                let killDockerTimer = setTimeout(function(){
                    //We ran out of time before this was canceled... therefore we need to kill the docker container...
                    exec(killCmd);
                    cont = false;
                    timeout = true;
                }, sandbox.timeout);

                //Babysitter checks to see if were done every second. Then it does cleanup.
                let babysitter = setInterval(function () {
                    if(cont){
                        //We have not timed out...

                        fs.readFile(completedFile, function (err, data) {
                            if(!err && cont){
                                clearTimeout(killDockerTimer);
                                cont = false;

                                //Check if there is an error file...
                                fs.readFile(errorFile, 'utf8', function (err2, data2) {
                                    if(!data2) data2 = "";

                                    let lines = data.toString().split('*-COMPILATIONSYSTEM::ENDOFOUTPUT-*');
                                    data = lines[0];
                                    let time = lines[1];
                                    exec(removeContainer);
                                    sandbox.cleanup();
                                    success({stdout:data, runTime:time, errorLog: data2});// Success function must take 3 parameters (stdout, timeran, errors)
                                    clearInterval(babysitter);
                                })
                            }
                        })
                    }else if (timeout){
                        //We have a timeout.
                        fs.readFile(logFile, 'utf8', function (err, data) {
                            if(!data) data = "";
                            data += "\nExecution Timed Out";
                            fs.readFile(errorFile, 'utf8', function (err2, data2) {
                                if(!data2) data2 = "";
                                let lines = data.toString().split('*-COMPILATIONSYSTEM::ENDOFOUTPUT-*');
                                data = lines[0];
                                let time = Math.floor(sandbox.timeout/1000);
                                exec(stop); // tecnically the kill -f should still work but it seems that this makes sure it works all the time.
                                exec(removeContainer);
                                sandbox.cleanup();
                                success({stdout:data, runTime:time, errorLog: data2});// Success function must take 3 parameters (stdout, timeRan, errors)
                                clearInterval(babysitter);
                            })
                        })
                    }
                }, 1000)
            }
        });
    }

    cleanup(){
        let exec = require('child_process').exec;
        let os = require('os');
        let isWin = /^win*/.test(os.platform());

        let remove = "";
        if(isWin){
            console.log("comming soon!!!");
        }else{
            remove = "rm -r " + this.rootpath + "/sandbox/" + this.folder;
        }
        exec(remove);
    }
};
