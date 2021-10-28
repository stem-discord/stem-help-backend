// eslint-disable-next-line
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: `module`,
  },
  extends: [`eslint:recommended`],
  rules: {
    "no-console": `warn`,
    "func-names": `off`,
    "no-underscore-dangle": `off`,
    "consistent-return": `off`,
    "jest/expect-expect": `off`,
    "security/detect-object-injection": `off`,
    "no-unused-vars": `warn`,

    "linebreak-style": [`error`, `unix`],
    semi: [`error`, `always`],
    quotes: [`error`, `backtick`],
    indent: [`error`, 2],
    "quote-props": [`error`, `as-needed`],
    strict: 0,
    "comma-dangle": [`error`, `always-multiline`],
    "space-infix-ops": [`error`, { int32Hint: false }],
    "eol-last": [`error`, `always`],
  },
};
