/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-23 21:14:32
 * @LastEditors: tianhaoliu tigooGame@home.com
 * @LastEditTime: 2026-08-23 22:35:19
 * @FilePath: \admin-electron-vite\src\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import type { App } from "vue";
import platformConfig from "./platform-config.json";

let config: object = { ...platformConfig };
// const { VITE_PUBLIC_PATH } = import.meta.env;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};
/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<PlatformConfigs> => {
  app.config.globalProperties.$config = getConfig();
  return getConfig();
};
/** 获取项目动态全局配置 */
// export const getPlatformConfig = async (app: App): Promise<undefined> => {
//   app.config.globalProperties.$config = getConfig();
//   return axios({
//     method: "get",
//     url: `${import.meta.env.BASE_URL}platform-config.json`
//   })
//     .then(({ data: config }) => {
//       let $config = app.config.globalProperties.$config;
//       // 自动注入系统配置
//       if (app && $config && typeof config === "object") {
//         $config = Object.assign($config, config);
//         app.config.globalProperties.$config = $config;
//         // 设置全局配置
//         setConfig($config);
//       }
//       return $config;
//     })
//     .catch(() => {
//       throw "请在public文件夹下添加platform-config.json配置文件";
//     });
// };

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

export { getConfig, setConfig, responsiveStorageNameSpace };
