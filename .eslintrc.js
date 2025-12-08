module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'dist/'],
};