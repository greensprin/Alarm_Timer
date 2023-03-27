'use strict'
const childProcess = require("child_process");
const { PythonShell } = require("python-shell");

exports.runCmd = function(cmd) { return runCmd(cmd) }
exports.runCmdSpawn = function(cmd, script="", pattern_file="") { return runCmdSpawn(cmd, script, pattern_file) }
exports.runPython = function(scripts_path, options=[]) { return runPython(scripts_path, options) }

let PROCESS_STATE = 0;

// コマンド実行 (非同期実行)
function runCmdSpawn(cmd, script="", pattern_file="") {
    var message = ""

    if (PROCESS_STATE === 0) {
        PROCESS_STATE = 1;
        const child = childProcess.spawn(cmd, [script, pattern_file]);
        child.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        child.stderr.on("data", (data) => {
            PROCESS_STATE = 0;
            console.log(data.toString());
        });
        child.on("close", (code) => {
            PROCESS_STATE = 0;
            console.log(`child process close all stdio with code ${code}`);
        })
    } else {
        console.log("process is already running.");
    }

    return message;
}

// コマンド実行 (同期実行)
function runCmd(cmd) {
    var message = "";
    childProcess.exec(cmd, (error, stdout, stderr) => {
        if (error != null) {
            console.log(error);
        } else {
            console.log(stdout);
            message = stdout;
        }
    })
    return message;
}

// Pythonを実行する関数 (非同期実行)
function runPython(scripts_path, options=[]) {
    const pyshell = new PythonShell(scripts_path, options);

    if (PROCESS_STATE === 0) {
        PROCESS_STATE = 1;
        pyshell.on("message", function (message) {
            console.log(message);
        })
        // pythonスクリプトの実行を終了するメソッド (pythonスクリプトにEOFを送信して標準入力を閉じるらしい)
        pyshell.end(function (err) {
            PROCESS_STATE = 0;
            if (err) throw err;
            // console.log("finished")
        })
    } else {
        console.log("process is already running.");
    }
}