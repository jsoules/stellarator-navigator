import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslint from '@eslint/js'
import path from 'path'
import { fileURLToPath } from 'url'
import react from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// Consider adding jsdoc plugin
// Consider adding accessibility plugin eg eslint-plugin-jsx-a11y

// TODO:
// - resume using rules for react-hooks
// - resume using rules for react/recommended
// - add a jsdoc plugin & maybe document things or something

// A manual copy of the rules from https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/recommended.js
// This should almost certainly be replaced once they have their act together for a
// decent user-friendly rules configuration that doesn't require overwrite nonsense
// const reactRecommendedRules = {
//     'react/display-name': 'error',
//     'react/jsx-key': 'error',
//     'react/jsx-no-comment-textnodes': 'error',
//     'react/jsx-no-duplicate-props': 'error',
//     'react/jsx-no-target-blank': 'error',
//     'react/jsx-no-undef': 'error',
//     'react/jsx-uses-react': 'off',
//     'react/jsx-uses-vars': 'error',
//     'react/no-children-prop': 'error',
//     'react/no-danger-with-children': 'error',
//     'react/no-deprecated': 'error',
//     'react/no-direct-mutation-state': 'error',
//     'react/no-find-dom-node': 'error',
//     'react/no-is-mounted': 'error',
//     'react/no-render-return-value': 'error',
//     'react/no-string-refs': 'error',
//     'react/no-unescaped-entities': 'error',
//     'react/no-unknown-property': 'error',
//     'react/no-unsafe': 'error',
//     'react/prop-types': 'error',
//     'react/react-in-jsx-scope': 'off',
//     'react/require-render-return': 'error',
// }

export default tseslint.config(
    // ...react.configs.recommended,
    // ...jsxRuntime,
    // ...hooksPlugin.configs.recommended,
    {
        // NOTE: "extends" may (it's unclear) be considered less desirable
        // style with flat config. However, this works & the other things
        // I tried didn't, so we're doing it for now!
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            // stylisticTypeChecked has some rules that are sometimes
            // wrong (i.e. cause incorrect behavior), so don't be
            // afraid to ignore it (by adding to rules/local overrides)
            // when needed.
            ...tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            // ????
            // ecmaVersion: 'latest', // this is now default
            globals: {
                ...globals.browser,
                ...globals.es2020
            },
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.node.json'],
                sconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
            },
            // sourceType: 'module',  // this is now default
        },
        linterOptions: {
            reportUnusedDisableDirectives: "warn",
        },
        plugins: {
            // ts-eslint doesn't need to be explicitly included, probably b/c
            // it's already present in the "extends" list above.
            // '@typescript-eslint': tseslint.plugin,
            "react-refresh": reactRefresh,
            "react-hooks": hooksPlugin,
            "react": react,
        },
        rules: {
            // NOTE: Revisit this; react-hooks is still updating & should have
            // more convenient/stable config around this soon.
            // NOTE: Hooks plugin is currently in a broken state--does not
            // support the ESLint 9 API.
            // TODO: Revisit this in a few weeks/months!
            // ...hooksPlugin.configs.recommended.rules,
            semi: ["error", "never"],
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            // 'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/restrict-template-expressions': [
                'warn',
                {
                    "allowBoolean": true,
                    "allowNumber": true,
                    "allowNullish": true,
                }
            ],
            // Unfortunately we do a lot of potentially-unsafe casting to make the
            // data dictionary work; linter doesn't realize how unsafe it is
            // and encourages us to remove safety rails that are actually needful
            '@typescript-eslint/no-unnecessary-condition': 'off',
            // Favor types over interfaces
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-inferrable-types': 'off',
            // These rules are not yet using the ESLint 9.0 API
            // ...reactRecommendedRules,
        }
    },
    // NOTE: For ignores to apply globally, they must be in their own separate
    // config object. See https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    {
        // TODO: Remove .eslintrc.csj when file is removed
        ignores: ['dist', 'eslint.config.js', 'coverage', '**/*.js'],
    }
)
