"use strict";

const { app, BrowserWindow } = require('electron');
const path = require('path');
const debugMode = true;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // If you need to access Node.js APIs from the renderer, 
      // you should use a preload script.
    },
  });

  // Load the index.html file from the current directory
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Debug Mode Toggles
  if (debugMode == false) {
    mainWindow.setMenuBarVisibility(false);
  }
  

  mainWindow.on('closed', function () {
    mainWindow.destroy();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On Windows, it's common to close all windows when the app is closed.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS, it's common to re-create a window if the app is activated while no windows are open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
