const config = require('../index');

const baseConf = {
  cwd: config('ENV.root'),
  presets: [
    ['@babel/preset-env', {
      modules: false,
    }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-export-default-from',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-transform-runtime', {
      absoluteRuntime: true,
      corejs: 2,
    }],
  ],
};

if (config('RC.react')) {
  baseConf.presets.push(
    ['@babel/preset-react', {
      development: process.env.NODE_ENV === 'development',
    }],
  );
}

module.exports = baseConf;