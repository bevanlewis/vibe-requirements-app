/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/__tests__/setup.ts",
  ],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};

export default config;
