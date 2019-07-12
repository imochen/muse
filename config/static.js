const ACTION = {
  BUILD: 'build',
  WATCH: 'watch',
  DEPLOY: 'deploy',
  CREATE: 'create',
  NEW: 'new',
  LINT: 'lint',
};

const PROCESS_KEY = {
  ENV: 'MUSE_ENV',
  OPTIONS: 'MUSE_OPTIONS',
  PROJECT: 'MUSE_PROJECT',
  RC: 'MUSE_RC',
  RUN: 'MUSE_RUN',

  START: 'MUSE_',
  REGEXP: 'RegExp',
};

const WEBPACK = {
  baseExclude: /(node_modules|bower_components)/,
  // browserList: ['iOS >= 8.1.2', 'Android >= 4.4', 'ie >= 9', ' > 0.25%'],
  eslint: ['js', 'jsx', 'ts', 'vue'],
  stylelint: ['less', 'css'],
  src: 'src',
};

module.exports = {
  ACTION,
  PROCESS_KEY,
  WEBPACK,
};