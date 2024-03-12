module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    // 'plugin:@typescript-eslint/stylistic-type-checked',  // use occasionally--more subjective
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // Haven't got the config on this perfect yet--
    // when using an IDE/editor started out of the root repo directory,
    // need to use this config.
    // Swap for the other when linting from the BASE/stellarator-navigator
    // directory (where eslint is actually installed.)
    // project: [path.join(__dirname, './tsconfig.json'),
    //           path.join(__dirname, './tsconfig.node.json')],
    project: ['./tsconfig.json', './tsconfig.node.json'],
    sconfigRootDir: __dirname,
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/prefer-literal-enum-member": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    // Unfortunately we do a lot of potentially-unsafe casting to make the
    // data dictionary work; linter doesn't realize how unsafe it is
    // and encourages us to remove safety rails that are actually needful
    "@typescript-eslint/no-unnecessary-condition": "off",
  },
}
