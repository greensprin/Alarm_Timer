'use strict'

const { app, BrowserWindow, ipcMain, dialog } = require( 'electron' );
const path = require("path");
require("date-utils");

// ==== Local Lib ====
// Renderer -> Main 通信の関数
const {
    SampleFunc
} = require( './app/lib/ipcMainHandleFunc' )

const cur_dir  = process.cwd()
const tool_dir = process.cwd();
let gui = null;

let current_dt = null;
let start_dt = null;
let elappsed_time = null;
const OVERTIME_HOUR = 9;
let overtime_flg = 0;

app.on( 'ready', () =>
{
    let win_option = {
        // frame: false,
        width    : 330,
        height   : 250,
        minWidth : 330,
        minHeight: 250,
        maxWidth : 330,
        maxHeight: 250,
        autoHideMenuBar: true, // menu bar を自動で消してくれる
        webPreferences: {
            experimentalFeatures:   false,
            nodeIntegration:        false,
            contextIsolation: true,
            preload: __dirname + "/app/preload.js",
        }
    }

    gui = new BrowserWindow( win_option )
    gui.setAlwaysOnTop(true); // 常に最前面に表示
    gui.loadURL( path.join('file:', __dirname, 'app/html/index.html' ));
    //gui.setMenu(null); // tool bar を消す

    console.log(__dirname);

    // gui.webContents.openDevTools()     // debug

    // Main -> Renderer
    let timerID = setInterval(()=> {
        current_dt = new Date();
        const current_time = current_dt.toFormat("YYYY/MM/DD HH24:MI:SS");
        gui.webContents.send("update_current_time", current_time);

        if (start_dt != null) {
            elappsed_time = Math.round((current_dt - start_dt)/(1000));
            gui.webContents.send("update_elapssed_time", elappsed_time); // sec

            if (elappsed_time >= OVERTIME_HOUR * 60 * 60 && overtime_flg === 0) {
                dialog.showErrorBox("OVERTIME", "勤務を終了しましょう")
                overtime_flg = 1;
            }
        }
    }, 1000) // 1秒に１回render側に時間を送る

    // 終了処理
    gui.on("close", () => {
        // Main -> Renderer処理を終了させる
        clearInterval(timerID);
    })
} )

// ==== IPC通信 ====
ipcMain.handle("get_start_time", (e, args) => {
    start_dt = new Date();
    return start_dt.toFormat("YYYY/MM/DD HH24:MI:SS");
});