/**
 * 生产环境压缩代码
 */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (webpackConf, { config, env }) {
  const {
    RC: { cache, vue, react },
    RUN: { cachePath },
  } = config;

  if (env !== 'production') return webpackConf;

  webpackConf.optimization = {
    noEmitOnErrors: true,
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js$/i,
        cache: cache === false ? false : path.resolve(cachePath, 'uglifyjs/'),
        parallel: true,
        uglifyOptions: {
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