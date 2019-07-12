/**
 * webpack resolve
 */

const path = require('path');
const { WEBPACK } = require('../../config/static');

module.exports = function (webpackConf, { config, env }) {
  const {
    ENV: { root: museRoot },
    RC: { alias },
    PROJECT: {
      root: projectRoot,
      working_path, // eslint-disable-line
    },
  } = config;

  webpackConf.resolveLoader = {
    alias: {
      'muse-cdn-loader': require.resolve('../lib/muse-cdn-loader/'),
      'muse-compress-loader': require.resolve('../lib/muse-compress-loader/'),
    },
  };

  webpackConf.resolve = {
    modules: [
      path.resolve(museRoot, 'node_modules'),
      path.resolve(projectRoot, 'node_modules'),
      'node_modules',
    ],
    alias: Object.assign({}, alias, {
      vue$: env === 'production' ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
      '@muse': path.resolve(museRoot, 'node_modules'),
      '@node_modules': path.resolve(working_path, 'node_modules'),
      '@common': path.resolve(working_path, WEBPACK.src, 'common'),
      '@src': path.resolve(working_path, WEBPACK.src),
    }),
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.mjs',
      '.wasm',
      '.vue',
    ],
  };
  return webpackConf;
};