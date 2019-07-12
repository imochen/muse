const path = require('path');
const fse = require('fs-extra');

const xlog = require('../../../util/xlog');

module.exports = function build(data, exit) {
  const {
    RC, OPTIONS, PROJECT,
  } = data;

  if (RC.watch) {
    xlog.error('You`re in watch mode. Can`t use build command');
    exit();
  }
  if (OPTIONS.page === 'all') {
    fse.removeSync(path.resolve(PROJECT.root, RC.buildDist));
  }
  return data;
};