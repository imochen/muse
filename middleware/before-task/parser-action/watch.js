const xlog = require('../../../util/xlog');

module.exports = function build(data, exit) {
  const {
    RC: { watch },
  } = data;

  if (!watch) {
    xlog.error('Couldn`t use watch command. Please make sure your project support watch mode');
    exit();
  }
  return data;
};