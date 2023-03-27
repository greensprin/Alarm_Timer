const { contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("api", {
  // renderer -> main
  get_start_time : async (args) => await ipcRenderer.invoke("get_start_time" , args),

  // main -> renderer
  on: (channel, callback) => ipcRenderer.on(channel, (event, args) => callback(event, args)),
});