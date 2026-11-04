const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mythreonDesktop', {
  isDesktop: true,
  checkForUpdate: () => ipcRenderer.invoke('mythreon:check-update'),
  downloadUpdate: () => ipcRenderer.invoke('mythreon:download-update'),
  openUpdate: () => ipcRenderer.invoke('mythreon:open-update'),
  onUpdate: callback => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('mythreon:update', handler);
    return () => ipcRenderer.removeListener('mythreon:update', handler);
  },
});
