const HtmlWebpackPlugin = require('html-webpack-plugin');

class LooseInject {
  apply(compiler) {
    compiler.hooks.compilation.tap('LOOSE INJECT', (compilation) => {
      compilation.hooks.afterOptimizeAssets.tap('LOOSE INJECT', () => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'LOOSE INJECT',
          async (htmlPluginData, cb) => {
            let { html } = htmlPluginData;
            const jsMatches = html.match(/(<script[^<>]+\>\<\/script>)<\/body\>/); // eslint-disable-line
            if (jsMatches) {
              html = html.replace(jsMatches[0], '</body>');
              html = html.replace(/\<muse\s+js\>\<\/muse\>/, jsMatches[1]); // eslint-disable-line
            }
            const cssMatches = html.match(/(<link[^<>]+\>)\<\/head\>/); // eslint-disable-line
            if (cssMatches) {
              html = html.replace(cssMatches[0], '</head>');
              html = html.replace(/\<muse\s+css\>\<\/muse\>/, cssMatches[1]); // eslint-disable-line
            }
            htmlPluginData.html = html;
            cb(null, htmlPluginData);
          },
        );
      });
    });
  }
}

module.exports = function (webpackConf, { config }) {
  const {
    RC: { loose },
  } = config;

  if (!loose) return webpackConf;

  webpackConf.plugins.push(
    new LooseInject(),
  );

  return webpackConf;
};