// 任务开始之前
const { requireIfExsit } = require('../../util/index');

module.exports = function beforeTask(data, exit) {
  const {
    OPTIONS: {
      action,
    },
  } = data;

  data = require('./parser-project-env')(data, exit);
  data = require('./parser-muse-config')(data, exit);

  const parser = requireIfExsit(__dirname, `parser-action/${action}`);
  if (parser) {
    data = parser(data, exit);
  }

  data = require('./parser-run-config')(data, exit);

  return data;
};