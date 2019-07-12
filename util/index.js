const fs = require('fs');
const path = require('path');

const IMAGE_EXTS = ['svg', 'wbmp', 'png', 'bmp', 'fax', 'gif', 'ico', 'jpe', 'jpeg', 'jpg', 'cur', 'webp'];

const { isBoolean, isArray, isRegExp, isPlainObject, isNumber } = require('lodash');

const xlog = require('./xlog');

const { WEBPACK } = require('../config/static');

function isImg(ext) {
  return IMAGE_EXTS.includes(ext);
}

function fileExt(file = '') {
  const matches = file.match(/\.(\w+)$/);
  if (!matches) return null;
  return matches[1];
}

// 读取目录下以及所有文件夹，忽略隐藏文件夹，以及自定义忽略
function readFolders(dirname, exclude = []) {
  const dirs = fs.readdirSync(dirname);
  return dirs.filter((item) => {
    const stats = fs.statSync(path.resolve(dirname, item));
    if (!stats.isDirectory()) return false;
    if (item.indexOf('.') === 0) return false;
    if (exclude.indexOf(item) >= 0) return false;
    return true;
  });
}

// 递归读取目录下的所有文件，忽略隐藏文件
function readFiles(dirname, baseDir = '') {
  let ret = [];
  const dirs = fs.readdirSync(dirname);
  dirs.forEach((item) => {
    const itemPath = path.resolve(dirname, item);
    const stats = fs.statSync(itemPath);
    if (stats.isFile()) ret.push(path.join(baseDir, item));
    if (stats.isDirectory()) {
      ret = ret.concat(readFiles(itemPath, path.join(baseDir, item)));
    }
  });
  return ret;
}

// require一个文件，不存在返回null
function requireIfExsit(...args) {
  const filePath = path.resolve(...args);
  if (
    !fs.existsSync(filePath)
    && !fs.existsSync(filePath + '.js')
    && !fs.existsSync(filePath + '/index.js')
  ) return null;
  return require(filePath); // eslint-disable-line
}

// require一个文件，且文件内容是个function
function requireFunction(...args) {
  return requireIfExsit(...args) || function () {
    return null;
  };
}

// 请求并执行一个中间件
function requireMiddleware(name, params) {
  requireFunction(__dirname, '../middleware/', name)(params, () => process.exit(-1));
}

// 获取配置信息 module类型
function requireConfig(...args) {
  for (let i = 0; i < args.length; i++) {
    const filePath = path.resolve(...args[i]);
    if (fs.existsSync(filePath)) {
      try {
        return {
          error: null,
          file: filePath,
          data: require(filePath), // eslint-disable-line
        };
      } catch (err) {
        try {
          return {
            error: null,
            file: filePath,
            data: JSON.parse(fs.readFileSync(filePath, 'utf8')),
          };
        } catch (e) {
          xlog.error(err.message + ` in ${filePath}`);
          xlog.error(e.message + ` in ${filePath}`);
          process.exit(-1);
        }
      }
    }
  }
  return {
    error: -2,
    data: null,
  };
}

function setToEnv(json = {}, prefix = '') {
  Object.keys(json).forEach((key) => {
    const value = json[key];
    let stringValue;
    if (isArray(value)) {
      stringValue = `Array:${JSON.stringify(value)}`;
    } else if (isPlainObject(value)) {
      stringValue = `PlainObject:${JSON.stringify(value)}`;
    } else if (isRegExp(value)) {
      stringValue = `RegExp:${value.toString()}`;
    } else if (isBoolean(value)) {
      stringValue = `Boolean:${+value}`;
    } else if (isNumber(value)) {
      stringValue = `Number:${value}`;
    } else {
      stringValue = `String:${value}`;
    }
    process.env[`${prefix}_${key}`] = stringValue;
  });
}

function getFromEnv(key) {
  const originValue = process.env[key];
  if (!originValue) return undefined;

  const matches = process.env[key].match(/(\w+):(.*)/);
  if (!matches) return originValue;
  const [, type, stringValue] = matches;
  let value;

  if (['Array', 'PlainObject'].includes(type)) {
    value = JSON.parse(stringValue);
  } else if (type === 'RegExp') {
    value = eval(stringValue); // eslint-disable-line
  } else if (type === 'Boolean') {
    value = !!parseInt(stringValue, 10);
  } else if (type === 'Number') {
    value = parseInt(stringValue, 10);
  } else {
    value = stringValue;
  }
  return value;
}

function excludeFunc(modulePath, transpileDependencies = []) {
  if (transpileDependencies && transpileDependencies.length > 0) {
    return WEBPACK.baseExclude.test(modulePath)
      && (!new RegExp(transpileDependencies.map(v => `(${v})`).join('|')).test(modulePath));
  }
  return WEBPACK.baseExclude.test(modulePath);
}

module.exports = {
  readFolders,
  readFiles,
  requireFunction,
  requireMiddleware,
  requireIfExsit,
  requireConfig,
  setToEnv,
  getFromEnv,
  isImg,
  fileExt,
  excludeFunc,
};