module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "airbnb-base"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        // "no-use-before-define": ["error", { "functions": true, "classes": true }],
        // "no-use-before-define": ["error", { "variables": false }],
        // "eslint no-use-before-define": ["error", { "functions": false }]
    }
};