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
    "comma-dangle": [`error`, {
      arrays: `always-multiline`,
      objects: `always-multiline`,
      imports: `always-multiline`,
      exports: `always-multiline`,
      functions: `always-multiline`,
    }],
    "no-trailing-spaces": `error`,
    "space-infix-ops": [`error`, { int32Hint: false }],
    "eol-last": [`error`, `always`],
    "comma-style": [
      `error`,
      `last`,
      {
        exceptions: {
          ImportDeclaration: true,
        },
      },
    ],

    // this rule isn't customzied enough
    // "sort-imports": [`error`, {
    //   ignoreCase: true,
    //   ignoreDeclarationSort: false,
    //   ignoreMemberSort: false,
    //   memberSyntaxSortOrder: [`none`, `single`, `all`, `multiple`],
    //   allowSeparatedGroups: true,
    // }],
  },
};
