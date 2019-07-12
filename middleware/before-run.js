// muse运行之前，
// 此时用户参数已经解析完毕，将要开始执行处理程序
const path = require('path');

const updateNotice = require('update-notice');

const xlog = require('../util/xlog');
const { PROCESS_KEY } = require('../config/static');

const { setToEnv } = require('../util/index');

const bindUpdateNotice = (pkg) => {
  const notice = updateNotice({
    pkg,
    options: {
      registry: 'https://registry.npmjs.org',
      isSudo: true, // default false
      isGlobal: true, // default false
    },
  });

  process.on('exit', (code) => {
    if (code === 0) {
      notice.notify((c) => {
        return 'Changelog ' + c.magenta.underline('https://github.com/imochen/muse/blob/master/CHANGELOG.md');
      });
    }
  });
};

module.exports = function pkgUpdateNotice(data) {
  const { pkg, options } = data;
  bindUpdateNotice(pkg);

  const MUSE_ENV = {
    name: pkg.name,
    version: pkg.version,
    root: path.resolve(__dirname, '..'),
    cwd: process.cwd(),
    user: process.env.USER,
    _start: Date.now(),
  };

  const NODE_ENV = ['deploy'].indexOf(options.action) > -1 ? 'production' : 'development';
  process.env.NODE_ENV = NODE_ENV;
  xlog.info('Set process.env.NODE_ENV =', c => c.magenta(NODE_ENV));

  setToEnv(MUSE_ENV, PROCESS_KEY.ENV);
  data.ENV = MUSE_ENV;

  setToEnv(options, PROCESS_KEY.OPTIONS);
  data.OPTIONS = options;

  return data;
};