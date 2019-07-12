const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const get = function (key = '', cacheFile) {
  if (!fs.existsSync(cacheFile)) return undefined;
  let kvMap = {};
  try {
    kvMap = JSON.parse(fs.readFileSync(cacheFile));
  } catch (e) {
    fs.unlinkSync(cacheFile);
  }
  return key ? kvMap[key] : kvMap;
};

const set = function (kv, cacheFile) {
  let kvMap = {};
  try {
    kvMap = JSON.parse(fs.readFileSync(cacheFile));
  } catch (e) {
    mkdirp.sync(path.dirname(cacheFile));
  }
  fs.writeFileSync(
    cacheFile,
    JSON.stringify(Object.assign(kvMap, kv)),
  );
};

module.exports = {
  set,
  get,
};