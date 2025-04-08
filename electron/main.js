const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"), // Use preload for secure communication
    },
    scrollBounce: true, // ✅ Enables swipe back/forward on macOS
  });

  const indexPath = path.join(__dirname, "..", "build", "index.html");
  console.log("Loading from:", indexPath);

  mainWindow.loadFile(indexPath);

  // ✅ Handle swipe / Cmd+[ or Cmd+] for back/forward navigation
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown") {
      if (input.meta && input.key === "[") {
        if (mainWindow.webContents.canGoBack()) {
          mainWindow.webContents.goBack();
        }
      }
      if (input.meta && input.key === "]") {
        if (mainWindow.webContents.canGoForward()) {
          mainWindow.webContents.goForward();
        }
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ✅ Listen for the print request from the renderer process
ipcMain.handle("print-page", (event) => {
  if (mainWindow) {
    mainWindow.webContents.print(
      {
        silent: false,
        printBackground: true,
      },
      (success, failureReason) => {
        if (!success) {
          console.error("Print failed:", failureReason);
        } else {
          console.log("Print success!");
        }
      }
    );
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
