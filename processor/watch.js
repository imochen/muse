const spawn = require('../util/spawn');

const config = require('../config/index');
const xlog = require('../util/xlog');

module.exports = function () {
  const webpackDevBin = config('RUN.webpackDevBin');
  const webpackConfigFile = config('RUN.webpackConfigFile');
  xlog.info('Starting task', c => c.magenta(config('OPTIONS.action') + ' ' + config('OPTIONS.page')));
  return spawn(webpackDevBin, ['--config', webpackConfigFile], {
    stdio: 'inherit',
  });
};