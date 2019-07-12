const _ = require('lodash');
const path = require('path');

const webpack = require('webpack');

const config = require('../config/index');
const { requireFunction, readFiles } = require('../util/index');

module.exports = function () {
  let webpackConf = {
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV !== 'production' ? 'cheap-eval-source-map' : 'none',
    target: 'web',
    context: config('ENV.root'),
    module: {
      rules: [],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `"${process.env.NODE_ENV}"`,
        },
      }),
    ],
    stats: { children: false },
  };
  // 先对引用文件进行排序。可以通过a.1.js来决定index，默认是0
  readFiles(path.resolve(__dirname, 'addon')).filter(v => /\.js$/.test(v)).sort((a, b) => {
    const [, aIndex] = a.match(/\.(\d+)\.js$/) || [null, 0];
    const [, bIndex] = b.match(/\.(\d+)\.js$/) || [null, 0];
    return aIndex - bIndex;
  }).forEach((file) => {
    const result = requireFunction(__dirname, 'addon', file)(webpackConf, {
      env: process.env.NODE_ENV,
      config: config(),
    });
    if (result) webpackConf = result;
  });

  webpackConf = _.merge(webpackConf, config('RC.extendWebpackConf'));
  console.log(webpackConf);
  return webpackConf;
};
