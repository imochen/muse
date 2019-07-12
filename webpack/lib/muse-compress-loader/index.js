const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');

const chalk = require('chalk');

const webpackLog = require('webpack-log');
const validateOptions = require('schema-utils');
const loaderUtils = require('loader-utils');

const schema = require('./options.json');

const minify = require('../../../util/minify.js');
const { fileExt } = require('../../../util/index.js');

const LOADER_NAME = 'MUSE COMPRESS';

const wlog = webpackLog({
  name: LOADER_NAME,
});

const defaultOptions = {
  cache: true,
};
const memoryCache = {};
const miniQueue = {};

module.exports = function (source) {
  const content = source;

  const file = this.resourcePath;
  const ext = fileExt(file);
  const callback = this.async();

  if (!/(js|css)/.test(ext)) {
    callback(null, `module.exports = "${content}";`);
  }


  const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this) || {});
  validateOptions(schema, options, LOADER_NAME);

  const fileShortName = file.replace(options.filePrefix + '/', '');

  let cachePath;
  if (options.cache !== false) {
    cachePath = options.cache === true
      ? path.resolve(__dirname, 'cache/muse-compress-loader/')
      : options.cache;
    mkdirp.sync(cachePath);
  }

  const fileMd5 = loaderUtils.getHashDigest(source, 'md5');
  const isFirstCompress = !miniQueue[fileMd5];

  if (memoryCache[fileMd5]) {
    callback(null, memoryCache[fileMd5]);
    return;
  }

  if (options.cache) {
    try {
      const cacheData = fs.readFileSync(path.resolve(cachePath, fileMd5), 'utf-8');
      memoryCache[fileMd5] = cacheData;
      callback(null, cacheData);
      return;
    } catch (e) {
      // ignore
    }
  }

  if (!miniQueue[fileMd5]) {
    miniQueue[fileMd5] = (ext === 'js')
      ? minify.js(content, file)
      : minify.css(content);
  }

  miniQueue[fileMd5].then(ret => {
    memoryCache[fileMd5] = ret;
    if (isFirstCompress) {
      wlog.info([ // eslint-disable-line
        chalk.bgGreen('COMPRESS'),
        chalk.underline(fileShortName),
        chalk.green('✔'),
      ].join(' '));
      if (options.cache) {
        try {
          fs.writeFileSync(path.resolve(cachePath, fileMd5), ret, {
            encoding: 'utf-8',
          });
        } catch (e) {
          console.log(e);
          // ignore
        }
      }
    }
    callback(null, ret);
  });
};