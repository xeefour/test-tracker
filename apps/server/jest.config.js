/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  // Prisma's generated client ships as TS that ts-jest must compile.
  transformIgnorePatterns: ['/node_modules/(?!(@prisma)/)'],
  modulePaths: ['<rootDir>/src'],
};
