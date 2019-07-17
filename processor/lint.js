const path = require('path');

const spawn = require('../util/spawn');

const config = require('../config/index');
const { WEBPACK } = require('../config/static');
const xlog = require('../util/xlog');
const { requireConfig } = require('../util/index');

module.exports = function () {
  const eslint = path.resolve(config('ENV.root'), 'node_modules/eslint/bin/eslint.js');
  const stylelint = path.resolve(config('ENV.root'), 'node_modules/stylelint/bin/stylelint.js');
  xlog.info('Starting task', c => c.magenta(config('OPTIONS.action')));

  function spawnPromise(cmd, options, name) {
    return new Promise(resolve => {
      spawn(cmd, options, {
        stdio: 'inherit',
      }).on('close', CODE => {
        if (CODE === 0) {
          xlog.success(`${name} successfully!`);
        }
        resolve(CODE);
      });
    });
  }

  const TASKS = [];

  if (config('RC.eslint')) {
    const eslintConf = requireConfig(
      [config('PROJECT.working_path'), '.eslintrc'],
      [config('PROJECT.working_path'), '.eslintrc.js'],
      [config('ENV.root'), 'config/default/.eslintrc.js'],
    );
    const eslintOptions = [
      config('PROJECT.working_path'),
      '--ext', WEBPACK.eslint.join(','),
      '-c', eslintConf.file,
    ];
    if (config('OPTIONS.fix')) {
      eslintOptions.push('--fix');
    }
    xlog.info(c => c.green('Starting eslint...'));
    TASKS.push(spawnPromise(eslint, eslintOptions, 'eslint'));
  }

  if (config('RC.stylelint')) {
    const stylelintConf = requireConfig(
      [config('PROJECT.working_path'), '.stylelintrc'],
      [config('PROJECT.working_path'), 'stylelint.config.js'],
      [config('ENV.root'), 'config/default/stylelint.config.js'],
    );

    const stylelintOptions = [
      path.resolve(config('PROJECT.working_path'), `**/*.(${WEBPACK.stylelint.join('|')})`),
      '--config', stylelintConf.file,
    ];

    if (config('OPTIONS.fix')) {
      stylelintOptions.push('--fix');
    }
    xlog.info(c => c.green('Starting stylelint...'));
    TASKS.push(spawnPromise(stylelint, stylelintOptions, 'stylelint'));
  }

  if (TASKS.length === 0) {
    xlog.error('You have disabled eslint & stylelint');
  } else {
    Promise.all(TASKS).then((retCode) => {
      const ret = retCode.reduce((prev, next) => prev + next);
      if (ret !== 0) process.exit(1);
    });
  }

  return {
    on() { },
  };
};
