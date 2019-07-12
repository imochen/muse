// 用于挂载构建结束的钩子方法，主要用于上传CDN，暂时保留
const { requireIfExsit } = require('../../util/index');

module.exports = function (data, exit) {
  const {
    CODE,
    OPTIONS: {
      action,
    },
  } = data;

  if (CODE === 0) {
    const parser = requireIfExsit(__dirname, action);
    if (parser) {
      data = parser(data, exit);
    }
  }

  return data;
};