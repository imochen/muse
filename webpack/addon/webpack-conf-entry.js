/**
 * webpack entry
 */
const path = require('path');
const {
  WEBPACK,
} = require('../../config/static');

module.exports = function (webpackConf, { config }) {
  const {
    RC: { pagePath, lang },
    RUN: { pages },
    PROJECT: { working_path }, // eslint-disable-line
  } = config;

  webpackConf.entry = {};

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    webpackConf.entry[page] = [
      path.resolve(working_path, WEBPACK.src, `${pagePath.replace(/\${page}/g, page)}.${lang}`),
    ];
  }

  return webpackConf;
};