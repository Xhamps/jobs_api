/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ['lcov', 'html', 'text'],
  modulePathIgnorePatterns: ['dist', 'node_modules', 'coverage'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [ '/node_modules/', '/test/']
};
