const htmlparser = require('htmlparser2');
const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlResourcePreload {
  constructor() {
    this.PluginName = 'HTML RESOURCE PRELOAD';
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.PluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        this.PluginName,
        (data, cb) => {
          const { html } = data;
          let preloadTemplate = '';
          const parser = new htmlparser.Parser({
            onopentag: (name, attribs) => {
              if (!(attribs.href || attribs.src)) return;
              if (/[\\<\\>\\{\\}]/.test(attribs.href)) return; // 可能包含模版语法的时候return
              if (/[\\<\\>\\{\\}]/.test(attribs.src)) return; // 可能包含模版语法的时候return
              if (attribs.preload === 'false') return; // 明确不要preload return
              switch (name) {
                case 'script':
                  preloadTemplate += `<link rel='preload' href='${attribs.src}' as='script'>`;
                  break;
                case 'link':
                  if (attribs.rel === 'stylesheet') {
                    preloadTemplate += `<link rel='preload' href='${attribs.href}' as='style'>`;
                  }
                  break;
                case 'img':
                  preloadTemplate += `<link rel='preload' href='${attribs.src}' as='image'>`;
                  break;
                default:
              }
            },
          });
          parser.write(html);
          parser.end();
          data.html = html.replace('<head>', `<head>${preloadTemplate}`);
          cb(null, data);
        },
      );
    });
  }
}
module.exports = function (webpackConf, { config, env }) {
  const {
    RC: { preload },
  } = config;

  if (!preload || env !== 'production') return webpackConf;

  webpackConf.plugins.push(
    new HtmlResourcePreload(),
  );
  return webpackConf;
};