module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/strict'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    parserOptions: {
        "project": ["tsconfig.json"]
    },
    rules: {
        'no-unused-vars': "off"
    }
};