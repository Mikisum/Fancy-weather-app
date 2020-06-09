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
        'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['element'] }],
        "no-undef": ["error", { "typeof": true }],
        "no-console": "off",
    }
};