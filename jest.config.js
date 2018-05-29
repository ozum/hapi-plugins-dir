const ignores = ["/node_modules/", "/fixtures/", "/__tests__/helpers/", "/__test_supplements__/", "/__test_helpers__/", "__mocks__"];

const jestConfig = {
  testEnvironment: "node",
  collectCoverageFrom: ["lib/**/*.+(js|jsx|ts|tsx)"],
  testMatch: ["**/__tests__/**/*.+(js|jsx|ts|tsx)", "**/*.(test|spec).(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, "lib/(umd|cjs|esm)-entry.js$"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  watchPathIgnorePatterns: [...ignores],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
module.exports = jestConfig;
