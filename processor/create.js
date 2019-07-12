const fs = require('fs');
const path = require('path');

const config = require('../config/index');
const { readFiles } = require('../util/index');
const xlog = require('../util/xlog');

module.exports = function () {
  let name;
  readFiles(path.resolve(config('ENV.root'), 'config/default')).forEach(file => {
    if (file.includes(config('OPTIONS.file'))) {
      name = file;
    }
  });
  const configFilePath = path.resolve(config('PROJECT.working_path'), name);
  if (fs.existsSync(configFilePath)) {
    xlog.error(`${configFilePath} is already exists!`);
    process.exit(-1);
  }

  xlog.info('Starting create file', c => c.magenta(name));

  let fileContent = 'module.exports = {\n\n}'; // eslint-disable-line

  const NEED_COPY_FILES = [
    '.browserslistrc',
    'stylelint.config.js',
    '.eslintrc.js',
    'tsconfig.json',
  ];

  if (NEED_COPY_FILES.indexOf(name) > -1) {
    fileContent = fs.readFileSync(path.resolve(config('ENV.root'), `config/default/${name}`), 'utf-8');
  }

  // muserc 则将内容注释掉，并复制到项目目录
  if (name.includes('muserc')) {
    const muserc = path.resolve(config('ENV.root'), `config/default/${name}`);
    const contentArr = fs.readFileSync(muserc, 'utf-8').split(/(\n|\r|\n\r)/);
    fileContent = contentArr.map((val) => {
      if (val.indexOf(' ') === 0) {
        return `  // ${val.trim()}`;
      }
      return val;
    }).join('');
  }

  fs.writeFileSync(configFilePath, fileContent, {
    encoding: 'utf-8',
  });

  xlog.success(`${configFilePath} created successfully!`);

  return {
    on() { },
  };
};