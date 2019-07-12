const path = require('path');

const { isString } = require('lodash');

const {
  PROCESS_KEY: {
    RUN: RUN_KEY,
  },
  WEBPACK,
} = require('../../config/static');
const {
  readFolders,
  setToEnv,
} = require('../../util/index');

module.exports = function (data) {
  const {
    ENV: { root },
    OPTIONS: { page },
    PROJECT: { working_path }, // eslint-disable-line
    RC: {
      exclude,
      cache,
    },
  } = data;

  const RUN = {};
  RUN.pages = page === 'all' ? readFolders(path.resolve(working_path, WEBPACK.src), exclude) : [page];
  RUN.cachePath = path.resolve(working_path, isString(cache) ? cache : '.muse-cache/');

  RUN.webpackConfigFile = path.resolve(root, 'webpack/index.js');
  RUN.webpackBin = path.resolve(root, 'node_modules/.bin/webpack');
  RUN.webpackDevBin = path.resolve(root, 'node_modules/.bin/webpack-dev-server');

  setToEnv(RUN, RUN_KEY);
  data.RUN = RUN;

  return data;
};