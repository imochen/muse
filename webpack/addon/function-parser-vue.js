const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');

const { excludeFunc } = require('../../util/index');


module.exports = function (webpackConf, { config, env }) {
  const {
    RC: { vue, transpileDependencies },
    PROJECT: { working_path }, // eslint-disable-line
  } = config;

  if (!vue) return webpackConf;

  // 使用用户项目下的vue-template-compiler，这样可以保证vue-template-compiler和vue版本一致
  const userVueCompiler = path.resolve(working_path, 'node_modules/vue-template-compiler');

  webpackConf.module.rules.push({
    test: /\.vue$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    use: [{
      loader: 'vue-loader',
      options: {
        productionMode: env === 'production',
        hotReload: env !== 'production',
        compiler: require(userVueCompiler), // eslint-disable-line
      },
    }],
  });

  webpackConf.plugins.push(
    new VueLoaderPlugin(),
  );

  return webpackConf;
};