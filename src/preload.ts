// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import type { ValSettings } from 'types';

contextBridge.exposeInMainWorld('valleryAPI', {
  selectFiles: async (): Promise<string[]> => {
    // invoke is async
    return await ipcRenderer.invoke('dialog:selectFiles');
  },
  getRandomNum: async (lo: number, hi: number): Promise<number> => {
    return await ipcRenderer.invoke('getRandom', lo, hi);
  },
  getSettingsObj: async (): Promise<ValSettings> => {
    return await ipcRenderer.invoke('getStoreObj');
  },
  setSettingsObj: async (settingsObj: ValSettings) => {
    await ipcRenderer.invoke('setStoreObj', settingsObj);
  },
});
