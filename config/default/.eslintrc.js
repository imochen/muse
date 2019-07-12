module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
  ],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    $: false,
    xm: false,
  },
  rules: {
    strict: 0,
    'no-param-reassign': 0,
    'arrow-body-style': 0,
    'class-methods-use-this': 0,
    'func-names': 0,
    'prefer-template': 0,
    'no-bitwise': 0,
    'global-require': 0,
    'no-console': 0,
    'prefer-promise-reject-errors': 0,
    'no-plusplus': 0,
    'no-new': 0,
    'eol-last': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
  },
}