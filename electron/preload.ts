/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-23 21:35:00
 * @LastEditors: tianhaoliu tigooGame@home.com
 * @LastEditTime: 2026-08-23 21:41:11
 * @FilePath: \admin-electron-vite\electron\preload.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { contextBridge } from "electron";

// 通过 contextBridge 暴露给渲染进程的安全 API
// 后续需要调用主进程能力（文件读写、系统对话框等）时，在这里用 ipcRenderer 封装后暴露
const electronAPI = {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // 上下文未隔离时的兜底方案
  // @ts-ignore 运行时注入到 window
  window.electron = electronAPI;
}
