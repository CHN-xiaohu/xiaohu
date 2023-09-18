/* eslint-disable import/no-extraneous-dependencies */
module.exports = require('@spark-build/lint').default.defineESLint({
  globals: {
    page: true,
    __AppStore: true,
  },
  rules: {
    '@typescript-eslint/ban-types': 0,
    'react-hooks/exhaustive-deps': 0,
    '@typescript-eslint/no-unused-expressions': 0,
  },
});
