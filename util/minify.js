const csso = require('csso');
const uglifyJS = require('uglify-js');

module.exports = {
  js(content, file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const uglifyResult = uglifyJS.minify(content);
        if (uglifyResult.error) {
          const errObj = Object.assign(uglifyResult.error, {
            filename: file,
          });
          reject(new Error(JSON.stringify(errObj, null, 2)));
        }
        resolve(uglifyJS.minify(content).code);
      }, Math.random() * 20);
    });
  },
  css(content) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(csso.minify(content).css);
      }, Math.random() * 20);
    });
  },
};