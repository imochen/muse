const {
  START,
} = require('./static').PROCESS_KEY;

const { getFromEnv } = require('../util/index');

module.exports = function (path) {
  if (path) {
    return getFromEnv(`${START}${path.replace('.', '_')}`);
  }

  const config = {};
  Object.keys(process.env).filter(v => v.startsWith(START)).forEach((k) => {
    const matches = k.replace(START, '').match(/([A-Z]+)_(.*)/);
    if (!matches) return;
    const [, name, key] = matches;
    config[name] = config[name] || {};
    config[name][key] = getFromEnv(k);
  });
  return config;
};