/**
 * 清理dist目录
 */
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { ACTION } = require('../../config/static');

module.exports = function (webpackConf, { config }) {
  const { action } = config.OPTIONS;
  const { pages } = config.RUN;

  // 非deploy, build不需要清理dist
  if (![ACTION.DEPLOY, ACTION.BUILD].includes(action)) return webpackConf;

  // build, deploy单页，不需要清理dist
  if ([ACTION.DEPLOY, ACTION.BUILD].includes(action) && pages.length === 1) return webpackConf;

  webpackConf.plugins.unshift(
    new CleanWebpackPlugin([config.RC[`${action}Dist`]], {
      root: config.PROJECT.root,
    }),
  );
  return webpackConf;
};