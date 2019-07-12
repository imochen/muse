/**
 * webpack打包代码块分析
 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


module.exports = function (webpackConf, { config }) {
  if (!config.RC.debug) return webpackConf;

  webpackConf.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerHost: '0.0.0.0',
      analyzerPort: config.RC.debugPort,
      defaultSizes: 'parsed',
    }),
  );
  return webpackConf;
};