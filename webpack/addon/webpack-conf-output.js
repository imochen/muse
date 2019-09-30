/**
 * webpack output
 */
const path = require('path');
const {ACTION, } = require('../../config/static');

module.exports = function(webpackConf, {config, env}) {
  const {RC, RC: {devPublicPath, deployPublicPath}, OPTIONS: {action}, PROJECT: {root}, } = config;

  // dev 用 hash
  // prod 用 contenthash
  const hashKey = (env === 'production') ? 'contenthash' : 'hash';

  webpackConf.output = {
    path: path.resolve(root, RC[`${action}Dist`] || RC.buildDist),
    filename: `js/[name].[${hashKey}:18].js`,
    chunkFilename: `chunk/js/[name].[${hashKey}:18].js`,
    libraryTarget: 'umd',
    publicPath: (process.env.NODE_ENV === 'development' && devPublicPath)
      ? devPublicPath
      : '/',
    jsonpFunction: 'museWebpackJsonp', // 避免和第三方低版本构建工具冲突
  };

  if (action === ACTION.DEPLOY) {
    webpackConf.output.publicPath = deployPublicPath || '/';
  }

  return webpackConf;
};