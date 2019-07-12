const os = require('os');

const { merge } = require('lodash');
const HappyPack = require('happypack');

const { requireConfig } = require('../../util/index');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = function (webpackConf, { config }) {
  const {
    ENV: { root },
    PROJECT: { working_path }, // eslint-disable-line
  } = config;

  // babel config
  const babelConf = requireConfig(
    [working_path, '.babelrc'], // eslint-disable-line
    [working_path, '.babelrc.js'], // eslint-disable-line
    [working_path, 'babel.config.js'], // eslint-disable-line
    [root, 'config/default/babel.config.js'],
  ).data;

  webpackConf.plugins.push(
    new HappyPack({
      id: 'babel',
      loaders: [{
        loader: require.resolve('babel-loader'),
        options: merge(babelConf, {
          babelrc: false,
          configFile: false,
          sourceType: 'unambiguous',
        }),
      }],
      threadPool: happyThreadPool,
      verbose: true,
    }),
  );
  return webpackConf;
};