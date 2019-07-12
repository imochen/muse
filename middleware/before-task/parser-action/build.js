const xlog = require('../../../util/xlog');

module.exports = function build(data, exit) {
  const {
    RC: { watch },
  } = data;

  if (watch) {
    xlog.error('You`re in watch mode. Can`t use build command');
    exit();
  }
  return data;
};