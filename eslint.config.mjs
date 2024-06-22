import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import globals from "globals";

export default [
    {
        ignores: ["dist/*"],
    },
    {
        files: ["src/**/*.js", "eslint.config.mjs"],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.nodeBuiltin,
            },
        },
    },
    js.configs.recommended,
    {
        rules: {
            curly: "error",
            eqeqeq: "error",
            "dot-notation": "error",
            "new-cap": "error",
            "no-console": ["error", {allow: ["info", "warn", "error"]}],
            "no-unneeded-ternary": "warn",
            "no-useless-call": "error",
            "no-useless-computed-key": "error",
            "no-var": "error",
            "object-shorthand": "warn",
            "operator-assignment": "warn",
            "prefer-arrow-callback": ["error", {allowNamedFunctions: true}],
            "prefer-rest-params": "error",
        }
    },
    {
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        rules: {
            "@stylistic/js/array-bracket-spacing": "error",
            "@stylistic/js/arrow-spacing": "error",
            "@stylistic/js/block-spacing": ["error", "never"],
            "@stylistic/js/brace-style": "error",
            "@stylistic/js/comma-spacing": "error",
            "@stylistic/js/comma-style": "error",
            "@stylistic/js/computed-property-spacing": "error",
            "@stylistic/js/dot-location": ["error", "property"],
            "@stylistic/js/eol-last": "error",
            "@stylistic/js/function-call-spacing": "error",
            "@stylistic/js/indent": ["error", 4],
            "@stylistic/js/key-spacing": "error",
            "@stylistic/js/keyword-spacing": "error",
            "@stylistic/js/linebreak-style": "error",
            "@stylistic/js/new-parens": "error",
            "@stylistic/js/no-extra-semi": "error",
            "@stylistic/js/no-multi-spaces": "error",
            "@stylistic/js/no-trailing-spaces": "warn",
            "@stylistic/js/no-whitespace-before-property": "error",
            "@stylistic/js/object-curly-spacing": "error",
            "@stylistic/js/operator-linebreak": ["error", "after"],
            "@stylistic/js/quotes": "error",
            "@stylistic/js/rest-spread-spacing": "error",
            "@stylistic/js/semi": "error",
            "@stylistic/js/semi-spacing": "error",
            "@stylistic/js/semi-style": "error",
            "@stylistic/js/space-before-blocks": "error",
            "@stylistic/js/space-before-function-paren": ["error", {anonymous: "always", named: "never", asyncArrow: "always"}],
            "@stylistic/js/space-in-parens": "error",
            "@stylistic/js/space-infix-ops": "error",
            "@stylistic/js/space-unary-ops": "error",
            "@stylistic/js/spaced-comment": "warn",
            "@stylistic/js/switch-colon-spacing": "error",
            "@stylistic/js/template-curly-spacing": "error",
        },
    },
];
