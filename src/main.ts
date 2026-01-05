// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import createServer from '../server/server';
import crypto from 'crypto';
import Store from 'electron-store';
import { schema } from './store';
import { getLastPath } from './utils';
import type { ValSettingsUI } from 'types';
import type { IpcMainInvokeEvent } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;

// start ExpressJS server
createServer();

// initialize electron-store
const eStore = new Store({ schema });

// dialogWindowIsOpen flag
let dialogWindowIsOpen = false;

const createWindow = async () => {
  // Get primary display size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

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

  // open developer tools
  mainWindow.webContents.openDevTools();
};

const registerHandlers = (): void => {
  // Method to open file system dialog, get file list from user and return response to React
  ipcMain.handle('dialog:selectFiles', async (): Promise<string[]> => {
    // handle case in which a showOpenDialog window is already open
    if (dialogWindowIsOpen) return [] as string[];

    dialogWindowIsOpen = true;
    try {
      const startPath = eStore.get('lastPath');

      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov'] }],
        // conditionally spread in defaultPath property if not an empty string
        ...(startPath.length > 0 && { defaultPath: startPath }),
      });

      // update electron-store with the folder path of the last file in the filePaths array
      const fileSum = result.filePaths.length;
      if (fileSum > 0) {
        eStore.set('lastPath', getLastPath(result.filePaths[fileSum - 1]));
        // send file paths back to renderer
        return result.filePaths;
      } else {
        return [] as string[];
      }
    } catch (err) {
      console.log(`There was an error retrieving the file list: ${err}`);
      return [] as string[];
    } finally {
      dialogWindowIsOpen = false;
    }
  });

  // need to explicitly include implied 'event' in the following function call because the function takes additional parameters
  ipcMain.handle(
    'getRandom',
    async (
      event: IpcMainInvokeEvent,
      lo: number,
      hi: number
    ): Promise<number> => {
      return new Promise((res, rej) => {
        crypto.randomInt(lo, hi, (err, n) => {
          if (err) {
            console.log(
              `There was an error generating the random number: ${err}`
            );
            rej(err);
          }
          res(n);
        });
      });
    }
  );

  // handlers for electron-store
  ipcMain.handle('getStoreObj', (): ValSettingsUI => {
    return {
      randOrder: eStore.get('randOrder'),
      randStart: eStore.get('randStart'),
      autoStart: eStore.get('autoStart'),
      mute: eStore.get('mute'),
      vWidth: eStore.get('vWidth'),
      aspRatio: eStore.get('aspRatio') as [number, number],
      // lastPath: eStore.get('lastPath'),
    };
  });

  ipcMain.handle(
    'setStoreObj',
    (event: IpcMainInvokeEvent, settingsObj: ValSettingsUI): void => {
      eStore.set('randOrder', settingsObj.randOrder);
      eStore.set('randStart', settingsObj.randStart);
      eStore.set('autoStart', settingsObj.autoStart);
      eStore.set('mute', settingsObj.mute);
      eStore.set('vWidth', settingsObj.vWidth);
      eStore.set('aspRatio', settingsObj.aspRatio);
      // 'lastPath' property is set by 'dialog:selectFiles' handler
    }
  );
};

const initialize = async (): Promise<void> => {
  registerHandlers();
  try {
    await createWindow();
  } catch (err) {
    console.log(`There was an error initializing Electron: ${err}`);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialize);

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
