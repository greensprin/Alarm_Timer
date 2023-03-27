const log  = require("electron-log");

exports.writeLog = function(message, basefilename) { return writeLog(message, basefilename) }

function writeLog(message, basefilename) {
    // ログファイルを作成する
    var today = new Date();
    var year  = ('0000' + today.getFullYear()).slice(-4);
    var month = ('00' + (today.getMonth()+1)).slice(-2);
    var day   = ('00' + today.getDate()).slice(-2);
    var fileName = `${year}${month}${day}_${basefilename}.log`;
    log.transports.file.resolvePath = () => path.join(cur_dir, `logs/${fileName}`);
    // ログを書き込む
    log.info(message);
}