const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');

const config = require('../config/index');
const xlog = require('../util/xlog');

const { WEBPACK } = require('../config/static');

module.exports = function () {
  const name = config('OPTIONS.page');
  const workingPath = config('PROJECT.working_path');
  const dirPath = path.resolve(workingPath, `${WEBPACK.src}/${name}`);
  if (fs.existsSync(dirPath)) {
    xlog.error(`${dirPath} is already exists!`);
    process.exit(-1);
  }

  const files = [config('RC.lang'), 'html', 'less'].map((v) => {
    return path.resolve(workingPath, WEBPACK.src, config('RC.pagePath')).replace(/\${page}/g, name) + `.${v}`;
  });

  files.forEach(file => {
    const dir = path.dirname(file);
    mkdirp.sync(dir);
    fs.writeFileSync(file, '', {
      encoding: 'utf-8',
    });
    xlog.success(`${file} created successfully!`);
  });

  return {
    on() { },
  };
};