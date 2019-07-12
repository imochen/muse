const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const mime = require('mime');

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const webpackLog = require('webpack-log');

const schema = require('./options.json');

const lenna = require('../../../lib/lenna.js'); // 图片上传
const qstatic = require('../../../lib/qstatic.js'); // 静态资源上传
const cache = require('../../../util/cache.js'); // 缓存模块

const { isImg, url2SSL, fileExt } = require('../../../util/index.js'); // 工具方法

const LOADER_NAME = 'MUSE CDN';

const wlog = webpackLog({
  name: LOADER_NAME,
});

const defaultOptions = {
  cache: true,
};
let firstCall = true;
let memoryCache = {};

/**
 * uploadQueue为上传队列。使用fileMd5做为key，将上传方法缓存。
 * 单一promise执行完不会再重复执行，而后面同样key的上传，直接调用该缓存的then方法即可。
 * 单次运行该缓存生效，进程结束缓存归零。
 */
const uploadQueue = {};

module.exports = function (source) {
  const callback = this.async();
  const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this) || {});
  validateOptions(schema, options, LOADER_NAME);

  let cacheFile;
  if (options.cache !== false) {
    cacheFile = options.cache === true
      ? path.resolve(__dirname, 'cache/muse-cdn-loader.json')
      : options.cache;
  }

  if (firstCall) {
    memoryCache = cache.get('', cacheFile) || {};
    firstCall = false;
  }

  const file = this.resourcePath;
  const fileMd5 = loaderUtils.getHashDigest(source, 'md5');
  const isFirstUpload = !uploadQueue[fileMd5];
  const ext = options.mimetype || fileExt(file);
  const fileShortName = file.replace(options.filePrefix + '/', '');

  // 如果开启了缓存，尝试从缓存取一下
  if (options.cache && memoryCache[fileMd5]) {
    callback(null, `module.exports = "${url2SSL(memoryCache[fileMd5])}";`);
    return;
  }
  if (!uploadQueue[fileMd5]) {
    uploadQueue[fileMd5] = isImg(ext)
      ? lenna.upload(file, mime.getType(ext))
      : qstatic.upload(fs.readFileSync(file, 'base64'), ext);
  }

  uploadQueue[fileMd5].then(ret => {
    memoryCache[fileMd5] = ret.url;
    if (options.cache) {
      cache.set({
        [fileMd5]: ret.url,
      }, cacheFile);
    }
    const url = url2SSL(ret.url);
    isFirstUpload && wlog.info([ // eslint-disable-line
      chalk.bgMagenta('UPLOAD'),
      chalk.underline(fileShortName),
      chalk.green('✔'),
    ].join(' '));
    callback(null, `module.exports = "${url}";`);
  }).catch(err => {
    throw new Error(JSON.stringify({ message: err.message, filename: file }, null, 2));
  });
};