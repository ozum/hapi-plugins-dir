module.exports = {
  extends: ["eslint-config-airbnb-base", "prettier", "plugin:jest/recommended"],
  rules: {
    "no-cond-assign": ["error", "except-parens"],
    "linebreak-style": ["error", "unix"],
    "no-multi-spaces": ["off", { exceptions: { Property: true, VariableDeclarator: true, ImportDeclaration: true } }],
    "require-jsdoc": ["off", { require: { FunctionDeclaration: true, MethodDefinition: true, ClassDeclaration: true } }],
    "valid-jsdoc": ["error"],
    "max-len": ["off"],
    "new-cap": ["error", { capIsNewExceptions: ["List", "Map", "Set"] }],
  },
};
