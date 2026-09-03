# 添加electron-vite、electron-builder

```
pnpm install electron-vite electron-builder -D

```

# 添加构建脚本

script/pc.mjs
package.json -> script ->
"pc:dev": "node scripts/pc.mjs dev",
"pc:build": "node scripts/pc.mjs build",
"pc:preview": "node scripts/pc.mjs preview",

# 添加主进程代码

/electron/main.ts
/electron/preload.ts

# 添加主进程类型代码

/types/electron.d.ts

# 添加electron-vite-config.ts

electron.config.ts

# ！注意添加electron到pnpm.onlyBuiltDependencies,然后执行pnpm rebuild electron

问题定位清楚了：electron 包已安装，但它的二进制文件没有下载（node_modules/electron/dist/electron.exe 和 path.txt 都不存在）。

原因是 package.json 里的 pnpm.onlyBuiltDependencies 白名单里没有 electron，pnpm 默认阻止了不在白名单内依赖的 postinstall 脚本，而 electron 正是靠 postinstall 下载二进制文件的。

修复方法：把 electron 加入白名单，然后重建触发下载。

刚才我们在处理 pnpm pc:dev 启动报错的问题——根因是 electron 包没在 pnpm 的 onlyBuiltDependencies 白名单里，导致它的二进制文件没被下载。我已经把 electron 加进了 package.json 的白名单。

接下来需要跑一次 pnpm rebuild electron 来触发二进制下载，需要我继续吗？或者你有其他想先问的？
