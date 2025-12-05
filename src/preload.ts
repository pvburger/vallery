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
  // in the following getters and setters, 'K' is a generic key, while ValSettings[K] is the type associated with the value of the generic key
  getStoreVal: async <K extends keyof ValSettings>(
    storeKey: K
  ): Promise<ValSettings[K]> => {
    return await ipcRenderer.invoke('getStore', storeKey);
  },
  setStoreVal: async <K extends keyof ValSettings>(
    storeKey: K,
    keyVal: ValSettings[K]
  ) => {
    await ipcRenderer.invoke('setStore', storeKey, keyVal);
  },
});
