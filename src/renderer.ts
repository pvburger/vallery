/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import './components/App';
import type { ValSettingsUI } from 'types';

// Declare exposed API
declare global {
  // see preload.ts for a discussion of generics used in getStoreVal and setStoreVal below
  interface Window {
    valleryAPI: {
      selectFiles: () => Promise<string[]>;
      getRandomNum: (lo: number, hi: number) => Promise<number>;
      getSettingsObj: () => Promise<ValSettingsUI>;
      setSettingsObj: (settingsObj: ValSettingsUI) => void;
      reDefault: () => Promise<void>;
    };
  }
}

console.log('Hello World!');
