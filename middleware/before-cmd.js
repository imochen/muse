// muse命令开始之前
const semver = require('semver');
const xlog = require('../util/xlog');

module.exports = function beforeCMD(data, exit) {
  const {
    name,
    engines: { node },
  } = data.pkg;
  // 检查node版本是否跟符合运行需求
  if (semver.satisfies(process.version, node)) return data;

  xlog.box({
    content: (c) => {
      const msg = 'You are using Node ' + process.version
        + ' , but this version of ' + name
        + ' requires Node ' + node + '.'
        + '\nPlease upgrade your Node version.';
      return c.red(msg);
    },
    options: {
      borderColor: 'red',
    },
  });
  return exit();
};