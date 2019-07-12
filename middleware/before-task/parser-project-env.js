// 探测project环境
const fs = require('fs');
const path = require('path');

const readlineSync = require('readline-sync');

const xlog = require('../../util/xlog');
const { PROCESS_KEY } = require('../../config/static');
const {
  readFolders,
  setToEnv,
} = require('../../util/index');

module.exports = function detectionProjectEnv(data) {
  xlog.info(c => c.green('Start detection working path...'));
  const { ENV: { cwd: runPath } } = data;

  const PROJECT = {};
  const runPathArr = runPath.split(path.sep);


  if (fs.existsSync(path.resolve(runPath, 'websrc'))) {
    PROJECT.root = runPath;
  } else if (runPathArr[runPathArr.length - 1] === 'websrc') {
    PROJECT.root = path.resolve('..');
  } else if (runPathArr[runPathArr.length - 2] === 'websrc') {
    PROJECT.root = path.resolve('..', '..');
  }

  if (!PROJECT.root) {
    xlog.error(c => c.red('Can`t found working path. Please make sure that you are in the correct directory!'));
    process.exit(-1);
  }

  if (PROJECT.root && !PROJECT.working_path) {
    const systemDir = readFolders(path.resolve(PROJECT.root, 'websrc'));
    if (systemDir.length === 0) {
      xlog.error(c => c.red('Can`t found APP_SYSTEM. You should build a FE project under `' + path.resolve(PROJECT.root, 'websrc') + '`'));
      process.exit(-1);
    } else if (systemDir.length === 1) {
      // 发现一个则直接作为APP_SYSTEM
      [PROJECT.app_system] = systemDir;
      PROJECT.working_path = path.resolve(PROJECT.root, 'websrc', PROJECT.app_system);
    } else if (systemDir.indexOf(runPathArr[runPathArr.length - 1]) > -1) {
      // 发现了多个，但是当前在某一个目录下，直接将这个作为APP_SYSTEM
      PROJECT.app_system = runPathArr[runPathArr.length - 1];
      PROJECT.working_path = path.resolve(PROJECT.root, 'websrc', PROJECT.app_system);
    } else {
      const output = ['Found multiple APP_SYSTEM: '];
      systemDir.forEach((v, i) => {
        output.push(c => c.green('\n[' + (i + 1) + ']: ' + v));
      });
      xlog.info(...output);
      const choose = readlineSync.question('Please choose a APP_SYSTEM (default:1): ') || 1;
      PROJECT.app_system = systemDir[choose - 1]; // eslint-disable-line
      if (!PROJECT.app_system) { // eslint-disable-line
        xlog.error(c => c.red('Please choose a correct APP_SYSTEM!'));
        process.exit(-1);
      }
      PROJECT.working_path = path.resolve(PROJECT.root, 'websrc', PROJECT.app_system);
    }
  }

  // 项目名称
  PROJECT.name = PROJECT.root.split(path.sep).pop();

  setToEnv(PROJECT, PROCESS_KEY.PROJECT);
  data.PROJECT = PROJECT;

  return data;
};