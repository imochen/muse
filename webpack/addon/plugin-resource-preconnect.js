const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlResourcePreconnect {
  constructor(preconnect) {
    this.PluginName = 'HTML RESOURCE PRECONNECT';
    this.preconnect = preconnect;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.PluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        this.PluginName,
        (data, cb) => {
          const { html } = data;
          let preconnectTemplate = '';
          this.preconnect.forEach((host) => {
            preconnectTemplate += `<link rel='preconnect' href='${host}'>`;
          });
          data.html = html.replace('<head>', `<head>${preconnectTemplate}`);
          cb(null, data);
        },
      );
    });
  }
}

module.exports = function (webpackConf, { config, env }) {
  const {
    RC: { preconnect },
  } = config;

  if (
    !preconnect
    || !Array.isArray(preconnect)
    || preconnect.length === 0
    || env !== 'production'
  ) {
    return webpackConf;
  }

  webpackConf.plugins.push(
    new HtmlResourcePreconnect(preconnect),
  );

  return webpackConf;
};
