import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",

  // ✅ Add TypeScript support
  preset: "ts-jest",

  // ✅ Ensure Jest transforms TypeScript files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // ✅ Ensure Jest looks for test files in the correct directories
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],

  // ✅ Ignore node_modules and build folders for tests
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // ✅ Improve test output verbosity
  verbose: true,
};

export default config;
