/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-25 11:58:27
 * @LastEditors: tianhaoliu tigooGame@home.com
 * @LastEditTime: 2026-08-25 12:06:13
 * @FilePath: \admin-electron-vite\electron-builder\versionFile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const yaml = require("js-yaml");
const FILE_PATH = process.argv.slice(2)[0];
const FILE_VERSION = process.argv.slice(2)[1];
let SIZE = 0;
function hashFile(file, algorithm = "sha512", encoding = "base64", options) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    hash.on("error", reject).setEncoding(encoding);
    fs.createReadStream(
      file,
      Object.assign({}, options, {
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      })
    )
      .on("data", chunk => {
        SIZE += chunk.length;
      })
      .on("error", reject)
      .on("end", () => {
        hash.end();
        resolve(hash.read());
      })
      .pipe(hash, {
        end: false
      });
  });
}
const BUILDER_DIR = "dists";
const installerPath = path.resolve(__dirname, "../", `${BUILDER_DIR}/`, FILE_PATH);
hashFile(installerPath).then(res => {
  const obj = {
    version: FILE_VERSION,
    files: {
      url: FILE_PATH,
      sha512: res,
      size: SIZE
    },
    path: FILE_PATH,
    sha512: res,
    releaseDate: new Date().toJSON()
  };
  fs.writeFileSync(
    path.join(__dirname, "../", "latest.yml"),
    yaml.dump(obj, {
      lineWidth: -1
    })
  );
});
