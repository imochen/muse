module.exports = {
  babel: false, // 是否开启babel编译
  vue: false, // 是否支持vue，如开启vue，则自动开启babel
  react: false, // 是否开启react支持，如开启，则自动开启babel

  lang: 'js', // 支持[js, jsx, ts]

  watch: true, // 默认使用watch port模式
  devMode: 'port', // [sock, port]

  domain: '${user}.domain.com', // watch sock模式用到的
  devPort: 53000, //开发端口，port模式使用

  debug: false, //是否开启调试
  debugPort: 58120, // 调试端口


  buildDist: 'dist/${app_system}/dev', // build模式输出目录
  deployDist: 'dist/${app_system}/online', // deploy模式输出目录

  eslint: true, // muse 接管eslint检测
  stylelint: true, // muse 接管stylelint检测

  exclude: ['common', 'vue-common'], // 忽略的目录，该目录不会作为入口


  // 需要走编译的node_modules，一般为源码引入，ES6模块
  transpileDependencies: [
    '@rc-source/'
  ],

  // webpack 扩展配置
  extendWebpackConf: {
    externals: {}, // 官方externals
    node: {
      fs: 'empty'
    },
    resolve: {
      // webpack.resolve.alias，仅支持简单的kv配置，没有环境变量，
      // 主要应对 es module无法解析问题
      alias: {
        // 'async-validator': 'async-validator/lib/index.js', // 演示示例
      },
    }
  },



  cache: true, // 是否开启缓存
  htmlMinify: true, // 是否启用html压缩

  preload: true, //静态资源应用preload策略
  preconnect: [], // 预先对域名做 dns 查询，tcp 连接， ssl 连接

  pagePath: '${page}/index', // 目录规则

  devPublicPath: '', // 多级目录watch问题
  deployPublicPath: '/' // deploy时的publicPath
}