const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { WEBPACK } = require('../../config/static');

module.exports = function (webpackConf, { config }) {
  const {
    RC: { pagePath, htmlMinify },
    RUN: { pages },
    PROJECT: { working_path } // eslint-disable-line
  } = config;

  webpackConf.plugins.unshift(
    ...pages.map((page) => {
      return new HtmlWebpackPlugin({
        filename: page + '.html',
        template: path.resolve(working_path, WEBPACK.src, `${pagePath.replace(/\${page}/g, page)}.html`),
        minify: (process.env.NODE_ENV !== 'production' || htmlMinify === false) ? false : {
          removeComments: true,
          collapseWhitespace: true,
          preventAttributesEscaping: true,
          minifyJS: true,
          minifyCSS: true,
        },
        chunks: [page],
        inject: true,
      });
    }),
  );

  return webpackConf;
};