/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-23 21:42:24
 * @LastEditors: tianhaoliu tigooGame@home.com
 * @LastEditTime: 2026-08-23 21:42:34
 * @FilePath: \admin-electron-vite\scripts\pc.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// 删除会导致 Electron 以纯 Node 模式运行的环境变量。
// 若该变量存在（无论值为何），Electron 会跳过浏览器进程初始化，
// 导致主进程里 require("electron") 返回 stub、app/BrowserWindow 均为 undefined。
delete process.env.ELECTRON_RUN_AS_NODE;

const __dirname = dirname(fileURLToPath(import.meta.url));
const bin = join(
  __dirname,
  "..",
  "node_modules",
  "electron-vite",
  "bin",
  "electron-vite.js"
);
const args = process.argv.slice(2);

const child = spawn(process.execPath, [bin, ...args], {
  stdio: "inherit",
  env: process.env
});

child.on("error", err => {
  console.error(err);
  process.exit(1);
});
child.on("exit", code => {
  process.exit(code ?? 0);
});
