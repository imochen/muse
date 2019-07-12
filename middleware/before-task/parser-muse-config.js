const path = require('path');

const { isUndefined } = require('lodash');

const xlog = require('../../util/xlog');
const {
  requireConfig,
  setToEnv,
} = require('../../util/index');

const { PROCESS_KEY } = require('../../config/static');

const RC = require('../../config/default/.muserc');

module.exports = function getMuseConfig(data) {
  const { PROJECT, OPTIONS, ENV } = data;

  const userConfigFiles = [
    [PROJECT.working_path, '.muserc.js'], // 新配置文件
    [PROJECT.working_path, '.muserc'], // 旧配置文件
  ];
  if (OPTIONS.config) { // 如果用户指定了配置文件，则将其放入待检测队列
    userConfigFiles.unshift([ENV.cwd, OPTIONS.config]);
  }

  const userConfig = requireConfig(...userConfigFiles);

  if (!userConfig.error) {
    xlog.info('Use Config', c => c.magenta(userConfig.file));
    Object.keys(userConfig.data).forEach((k) => {
      if (isUndefined(RC[k])) {
        xlog.warning(...[
          `Your .muserc.js include unsupported configuration { ${k}: ${userConfig.data[k]} }\n`,
          'Please check and fix it\n',
          'DOC: https://github.com/imochen/muse/blob/master/config/default/.muserc.js',
        ]);
        return;
      }
      RC[k] = userConfig.data[k];
    });
  } else if (userConfig.error === -2) {
    if (['deploy', 'watch', 'build'].includes(OPTIONS.action)) {
      xlog.warning(...[
        'Config file `.muserc.js` not found!',
        '\n',
        'Use default config: ' + path.resolve(ENV.root, 'config/default/.muserc.js'),
      ]);
    }
  } else {
    xlog.error(`An error has occurred in [${userConfig.file}], Please fix it first!`);
    process.exit(-1);
  }

  // 命令行配置可以覆盖同名的配置项
  Object.keys(OPTIONS).forEach((k) => {
    if (isUndefined(RC[k])) return;
    if (OPTIONS[k] === 'true') {
      RC[k] = true;
    } else if (OPTIONS[k] === 'false') {
      RC[k] = false;
    } else {
      RC[k] = OPTIONS[k];
    }
  });

  RC.domain = RC.domain.replace('${user}', ENV.user); // eslint-disable-line
  ['buildDist', 'deployDist'].forEach((k) => {
    RC[k] = RC[k].replace('${app_system}', PROJECT.app_system);  // eslint-disable-line
  });

  if (RC.vue || RC.react) {
    RC.babel = true;
  }

  setToEnv(RC, PROCESS_KEY.RC);
  data.RC = RC;

  return data;
};