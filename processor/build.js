const spawn = require('../util/spawn');
const config = require('../config/index');
const xlog = require('../util/xlog');

module.exports = function () {
  const webpackBin = config('RUN.webpackBin');
  const webpackConfigFile = config('RUN.webpackConfigFile');
  xlog.info('Starting task', c => c.magenta(config('OPTIONS.action') + ' ' + config('OPTIONS.page')));
  return spawn(webpackBin, ['--config', webpackConfigFile], {
    stdio: 'inherit',
  });
};