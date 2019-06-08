module.exports = {
  'root': true,
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module'
  },
  'plugins': ['@typescript-eslint'],
  'extends': [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  'rules': {
    '@typescript-eslint/no-unused-vars': 'error',
    'indent': 'off',
    'vue/script-indent': ['warn', 2, {
      'baseIndent': 1
    }]
  }
}
