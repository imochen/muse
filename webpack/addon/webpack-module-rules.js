const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginFunctions = require('less-plugin-functions');

const { requireConfig, excludeFunc } = require('../../util/index');
const { WEBPACK } = require('../../config/static');


module.exports = function (webpackConf, { env, config }) {
  const { RC: { cache, babel, react, loose, skipCompress, transpileDependencies, }, RUN: { cachePath }, ENV: { root }, PROJECT: { working_path }, // eslint-disable-line
  } = config;

  // postcss config
  const postcssConf = requireConfig(
    [working_path, 'postcss.config.js'], // eslint-disable-line
    [working_path, '.postcssrc'], // eslint-disable-line
    [root, 'config/default/postcss.config.js'],
  ).data;

  const loaders = {
    babel: 'happypack/loader?id=babel',
    css: 'css-loader',
    pug: {
      loader: 'pug-plain-loader',
      options: {
        basedir: working_path,
      },
    },
    typeScript: 'ts-loader',
    less: {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
        plugins: [new LessPluginFunctions()],
      },
    },
    url: {
      loader: 'url-loader',
      options: {
        limit: 1,
        name: '[ext]/[name].[hash:16].[ext]',
      },
    },
    cdn: {
      loader: 'muse-cdn-loader',
      options: {
        filePrefix: working_path,
        cache: cache === false ? false : path.resolve(cachePath, 'muse-cdn-loader.json'),
      },
    },
    compress: {
      loader: 'muse-compress-loader',
      options: {
        filePrefix: working_path,
        cache: cache === false ? false : path.resolve(cachePath, 'muse-compress-loader/'),
      },
    },
  };

  // .art
  webpackConf.module.rules.push({
    test: /\.art$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    use: [{
      loader: 'art-template-loader',
      options: {
        debug: env !== 'production',
        compileDebug: env !== 'production',
      },
    }, 'extract-loader', {
      loader: 'html-loader',
      options: {
        attrs: ['img:src'],
      },
    }],
  });
  // .hbs
  webpackConf.module.rules.push({
    test: /\.hbs$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    use: [{
      loader: 'handlebars-loader',
      options: {
        helperDirs: [path.resolve(working_path, WEBPACK.src, 'common/helpers/')],
      },
    }, 'extract-loader', {
      loader: 'html-loader',
      options: {
        attrs: ['img:src'],
      },
    }],
  });

  // .html
  webpackConf.module.rules.push({
    test: /\.html$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    use: [{
      loader: 'underscore-template-loader',
      options: {
        attributes: ['img:src', 'img:data-src', 'img:data-original', 'link:href', 'script:src'],
        // 因为我们不需要处理模块变量，所以此处改为了一个极其复杂的语法
        interpolate: '<%\\{\\[<(.+?)>\\]\\}>', // <{[<=hostname>]}>
        evaluate: '<%\\{%<([\\s\\S]+?)>%\\}>', // <{%<=hostname>%}>
        escape: '<%\\{\\{<(.+?)>\\}\\}>', // <{{<=hostname>}}>
      },
    }],
  });

  // .css
  webpackConf.module.rules.push({
    test: /\.css$/i,
    oneOf: [
      {
        resourceQuery: /skip/,
        use: [loaders.url].concat(
          (env === 'production' && skipCompress) ? [loaders.compress] : [],
        ),
      }, {
        use: env === 'production'
          ? [MiniCssExtractPlugin.loader, loaders.css, {
            loader: 'postcss-loader',
            options: postcssConf,
          }]
          : [loose ? MiniCssExtractPlugin.loader : 'style-loader', loaders.css],
      },
    ],
  });

  // .less
  webpackConf.module.rules.push({
    test: /\.less$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    use: (
      env === 'production'
        ? [MiniCssExtractPlugin.loader, loaders.css, {
          loader: 'postcss-loader',
          options: postcssConf,
        }]
        : [loose ? MiniCssExtractPlugin.loader : 'style-loader', loaders.css]
    ).concat(loaders.less),
  });

  // image
  webpackConf.module.rules.push({
    test: /\.(jpe?g|png|gif|svg)$/i,
    exclude(modulePath) {
      return excludeFunc(modulePath, transpileDependencies);
    },
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1000000000, // 强制图片inline
          },
        }],
      }, {
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10,
            name: 'img/[hash:16].[ext]',
          },
        }],
        // use: env === 'production'
        // ? [loaders.cdn]
        // : [{
        //   loader: 'url-loader',
        //   options: {
        //     limit: 10,
        //     name: 'img/[hash:16].[ext]',
        //   },
        // }],
      },
    ],
  });

  // font
  webpackConf.module.rules.push({
    test: /\.(eot|woff|woff2|ttf|otf|svg)$/i,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'font/[name].[ext]',
      },
    }],
    // use: env === 'production'
    //   ? [loaders.cdn]
    //   : ['file-loader'],
  });

  // audio
  webpackConf.module.rules.push({
    test: /\.(mp3|wav|ogg)$/i,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'audio/[name].[ext]',
      },
    }],
    // use: env === 'production'
    //   ? [loaders.cdn]
    //   : ['file-loader'],
  });

  // .js
  webpackConf.module.rules.push({
    test: /\.js$/,
    oneOf: [{
      resourceQuery: /skip/,
      use: [loaders.url].concat(
        (env === 'production' && skipCompress) ? [loaders.compress] : [],
      ),
    }, {
      resourceQuery: /babel/,
      use: [loaders.babel],
    }].concat(
      babel ? {
        exclude(modulePath) {
          return excludeFunc(modulePath, transpileDependencies);
        },
        use: [loaders.babel],
      } : [],
    ),
  });

  // .jsx
  react && webpackConf.module.rules.push({ // eslint-disable-line
    test: /\.jsx$/,
    use: [loaders.babel],
  });

  // .ts
  webpackConf.module.rules.push({
    test: /\.ts$/,
    loader: loaders.typeScript,
    options: {
      appendTsSuffixTo: [/\.vue$/],
    },
  });

  // .pug
  webpackConf.module.rules.push({
    test: /\.pug$/,
    oneOf: [
      {
        resourceQuery: /^\?vue/,
        use: [loaders.pug],
      },
      {
        use: ['raw-loader', loaders.pug],
      },
    ],
  });

  return webpackConf;
};
