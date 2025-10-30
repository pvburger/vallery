import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  // Get primary display size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Staring with Electron 20, sandbox is enabled by default
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Method to open file system dialog, get file list from user and return
// response to React
ipcMain.handle('dialog:selectFiles', async (): Promise<string[]> => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov'] }],
    });
    // send file paths back to renderer
    return result.filePaths;
  } catch (err) {
    console.log(`There was an error retrieving the file list: ${err}`);
    return [] as string[];
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
