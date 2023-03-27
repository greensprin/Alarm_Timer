const { PythonShell } = require("python-shell");
const fs   = require("fs");
const path = require("path");
const ini  = require("ini");

// ==== Local Lib ====
// runCmd : コマンドの同期実行
// runCmdSpawn : コマンドの非同期実行
// runPython : python-shellのwrapper (非同期実行)
const { runCmd, runCmdSpawn, runPython } = require( './runcmd' )

// writeLog : ログ出力をするための関数wrapper
const { writeLog } = require( './writeLog' )

exports.SampleFunc = function(e, args) { return SampleFunc(e, args) }

pjdir = process.cwd() //  = ProjectNameDir/
// console.log(__dirname) // = ProjectNameDir/app/lib

function SampleFunc(e, args) {
    // 受け取った引数をログに表示
    console.log(args);

    // config.iniを読み込む
    const config = ini.parse(fs.readFileSync(path.join(pjdir, "/app/setting/config.ini"), "utf8"));
    console.log(config.sample.elem)

    // // ファイル書き込み サンプル
    // fs.writeFileSync(config, "[common]\n", "utf8");
    // fs.appendFileSync(config, "enable="+ary_arg[0]+"\n", "utf8");

    // // フォルダ内のファイルを取得
    // const filenames = fs.readdirSync(dir);
    // // ファイルを順番に処理する
    // filenames.forEach((filename) => {
    // })
    
    let cmd = `python ${pjdir}/app/scripts/sample.py`;
    // const message = runCmd(cmd);
    // const script = path.join(tool_dir, config.run.script);
    // const message = runCmdSpawn("python", script, pattern_file);

    // python実行
    runPython(`${pjdir}/app/scripts/sample.py`, { args: ["Sample Arg1", "Sample Arg2"] })

    return cmd
}