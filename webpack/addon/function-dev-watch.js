const path = require('path');

const mkdirp = require('mkdirp');
const webpack = require('webpack');

const { WEBPACK } = require('../../config/static');

module.exports = function (webpackConf, { config }) {
  const {
    OPTIONS: {
      action,
      page,
    },
  } = config;

  if (action === 'build' && page !== 'all') {
    webpackConf.watch = true;
    webpackConf.watchOptions = {
      aggregateTimeout: 300,
      ignored: WEBPACK.baseExclude,
      poll: 1000,
    };
  }
  if (action === 'watch') {
    const devServer = {
      host: '0.0.0.0',
      hot: true,
      inline: true,
      disableHostCheck: true,
      overlay: {
        warnings: true,
        errors: true,
      },
    };
    if (config.RC.devMode === 'sock') {
      const sockPath = path.resolve(config.PROJECT.root, 'run', config.PROJECT.app_system, config.ENV.user + '_dev_server.sock');
      mkdirp.sync(path.dirname(sockPath)); // 防止没有该目录，导致sock文件创建失败
      devServer.socket = sockPath;
      devServer.public = config.RC.domain + (config.RC.devPublicPath ? path.join(config.devPublicPath, '/sockjs-node') : '');
    } else {
      devServer.port = config.RC.devPort;
    }
    webpackConf.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
    );
    webpackConf.devServer = devServer;
  }

  return webpackConf;
};