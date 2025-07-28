const { contextBridge, ipcRenderer } = require('electron');

// 暴露受保护的方法，允许渲染器进程使用ipcRenderer，而不暴露整个对象
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 可以添加更多API方法
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 应用控制
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  
  // 通知相关
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
});

// 为了安全，移除node集成
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});