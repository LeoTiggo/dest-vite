/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-23 21:32:32
 * @LastEditors: tianhaoliu tigooGame@home.com
 * @LastEditTime: 2026-08-23 21:32:38
 * @FilePath: \admin-electron-vite\electron.vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { resolve } from "node:path";
import { defineConfig } from "electron-vite";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { type ConfigEnv, loadEnv } from "vite";
import {
  root,
  alias,
  wrapperEnv,
  pathResolve,
  __APP_INFO__
} from "./build/utils";

export default defineConfig(({ mode }: ConfigEnv) => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));

  return {
    main: {
      build: {
        rollupOptions: {
          input: { index: resolve(root, "electron/main.ts") },
          output: {
            format: "cjs",
            entryFileNames: "[name].cjs"
          }
        }
      }
    },
    preload: {
      build: {
        rollupOptions: {
          input: { index: resolve(root, "electron/preload.ts") },
          output: {
            format: "cjs",
            entryFileNames: "[name].cjs"
          }
        }
      }
    },
    renderer: {
      base: VITE_PUBLIC_PATH,
      root,
      resolve: {
        alias
      },
      server: {
        // 端口号
        port: VITE_PORT,
        host: "0.0.0.0",
        // 本地跨域代理
        proxy: {},
        // 预热文件以提前转换和缓存结果
        warmup: {
          clientFiles: ["./index.html", "./src/{views,components}/*"]
        }
      },
      plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
      optimizeDeps: {
        include,
        exclude
      },
      build: {
        sourcemap: false,
        // 消除打包大小超过500kb警告
        chunkSizeWarningLimit: 4000,
        rollupOptions: {
          input: {
            index: pathResolve("./index.html", import.meta.url)
          },
          // 静态资源分类打包
          output: {
            chunkFileNames: "static/js/[name]-[hash].js",
            entryFileNames: "static/js/[name]-[hash].js",
            assetFileNames: "static/[ext]/[name]-[hash].[ext]"
          }
        }
      },
      define: {
        __INTLIFY_PROD_DEVTOOLS__: false,
        __APP_INFO__: JSON.stringify(__APP_INFO__)
      }
    }
  };
});
