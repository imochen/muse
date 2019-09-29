/**
 * 生产环境压缩代码
 */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (webpackConf, { config, env }) {
  const {
    RC: { cache, vue, react },
    RUN: { cachePath },
  } = config;

  if (env !== 'production') return webpackConf;

  webpackConf.optimization = {
    noEmitOnErrors: false,
    minimizer: [
      new TerserPlugin({
        test: /\.js$/i,
        cache: cache === false ? false : path.resolve(cachePath, 'terser/'),
        parallel: true,
        terserOptions: {
          ie8: !(vue || react),
          output: {
            comments: false,
          },
        },
      }),
    ],
  };

  return webpackConf;
};