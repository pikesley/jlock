/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: ["node_modules", "static/js", "tests"],
  setupFiles: ["<rootDir>/tests/js/support/client.js"],
  testEnvironment: "jsdom",
};
