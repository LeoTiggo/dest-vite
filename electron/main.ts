import { app, BrowserWindow, shell } from "electron";
import { join } from "node:path";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    title: "pure-admin-thin",
    webPreferences: {
      // preload 以 CJS 输出为 index.cjs
      preload: join(__dirname, "../preload/index.cjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 窗口就绪后再显示，避免白屏闪烁
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 外部链接交给系统默认浏览器打开，而不是在应用内新开窗口
  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // 开发环境加载 electron-vite 注入的 dev server 地址，生产环境加载打包产物
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  // macOS 上点击 dock 图标且无窗口时，重新创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 非 macOS 平台，关闭所有窗口时退出应用
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
