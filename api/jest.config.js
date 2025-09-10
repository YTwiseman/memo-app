/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],   // テストファイル名パターン
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
