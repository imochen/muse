/**
 * css & js lint
 */
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const { WEBPACK } = require('../../config/static');
const { requireConfig } = require('../../util/index');
const xlog = require('../../util/xlog');

module.exports = function (webpackConf, { config }) {
  if (config.RC.eslint) {
    const eslintConf = requireConfig(
      [config.PROJECT.working_path, '.eslintrc'],
      [config.PROJECT.working_path, '.eslintrc.js'],
      [config.ENV.root, 'config/default/.eslintrc.js'],
    );

    webpackConf.module.rules.push({
      test: new RegExp(`\\.(${WEBPACK.eslint.join('|')})$`),
      exclude: WEBPACK.baseExclude,
      enforce: 'pre',
      use: [{
        loader: 'eslint-loader',
        options: {
          configFile: eslintConf.file,
          useEslintrc: false,
          emitError: true,
          emitWarning: true,
          eslintPath: path.resolve(config.ENV.root, 'node_modules/eslint'),
        },
      }],
    });
  } else {
    xlog.warning(
      'Detected that you have disabed eslint.',
      '\n',
      'For your personal safety, Please standardize your code!',
    );
  }
  if (config.RC.stylelint) {
    const stylelintConf = requireConfig(
      [config.PROJECT.working_path, '.stylelintrc'],
      [config.PROJECT.working_path, 'stylelint.config.js'],
      [config.ENV.root, 'config/default/stylelint.config.js'],
    );
    webpackConf.plugins.push(
      new StyleLintPlugin({
        context: config.PROJECT.working_path,
        files: `**/*.(${WEBPACK.stylelint.join('|')})`,
        configFile: stylelintConf.file,
      }),
    );
  } else {
    xlog.warning(
      'Detected that you have disabed stylelint.',
      '\n',
      'For your personal safety, Please standardize your code!',
    );
  }
  return webpackConf;
};