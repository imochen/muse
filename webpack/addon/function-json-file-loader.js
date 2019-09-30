module.exports = function(webpackConf) {
  webpackConf.module.rules.push({
    type: 'javascript/auto',
    test: /\.json$/i,
    oneOf: [
      {
        resourceQuery: /file/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      },
      {
        use: [{
          loader: 'json-loader',
        }],
      },
    ],
  });

  return webpackConf;
};