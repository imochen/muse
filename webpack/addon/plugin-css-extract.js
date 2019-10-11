/**
 * 提取CSS
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (webpackConf, { env, config }) {
  // production模式或者loose模式开启css抽取
  if (env !== 'production' && !config.RC.loose) return webpackConf;

  webpackConf.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:18].css',
      chunkFilename: '[name].[contenthash:18].css',
    }),
  );

  return webpackConf;
};