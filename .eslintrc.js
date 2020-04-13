module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  root: true,
  plugins: [
    "@typescript-eslint",
    "import",
    "unicorn",
    "prettier"
  ],
  extends: [
    "eslint:recommended",
    'airbnb-base',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "mjs": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ]
  },
  settings: {
    "import/resolver": {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
