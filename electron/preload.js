console.log("Preload script loaded");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printPage: () => {
    console.log("printPage invoked");
    return ipcRenderer.invoke("print-page");
  },
});
