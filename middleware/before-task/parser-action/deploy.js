const path = require('path');
const fse = require('fs-extra');

const readlineSync = require('readline-sync');

const { PROCESS_KEY } = require('../../../config/static');
const { setToEnv } = require('../../../util/index');
const xlog = require('../../../util/xlog');

module.exports = function build(data) {
  const { OPTIONS, PROJECT, RC } = data;

  if (OPTIONS.page !== 'all') {
    xlog.warning(
      'Deploy single page is forbidden in muse!',
      '\n',
      'I hope you know what you are doing now!',
    );
    const next = readlineSync.question(`Continue to deploy ${OPTIONS.page}? (y/n): `);
    if (next !== 'y') {
      OPTIONS.page = 'all';
    }
  } else {
    fse.removeSync(path.resolve(PROJECT.root, RC.deployDist));
  }
  setToEnv(OPTIONS, PROCESS_KEY.OPTIONS);
  data.OPTIONS = OPTIONS;
  return data;
};