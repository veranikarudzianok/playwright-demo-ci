import { defineConfig, devices } from "@playwright/test";
import * as os from 'os';

require("dotenv").config();

export default defineConfig({
  timeout: 60000,
  globalTimeout: 300000,
  expect: {
    timeout: 6000,
  },
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["list", { printSteps: true }],
    ["junit", { outputFile: "test-results/junitReport.xml" }],
    ["json", { outputFile: "test-results/jsonReport.json" }],
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        uploadToArgos: !!process.env.CI
      },
    ],
    ["line"], 
    ["allure-playwright",
      {
        resultsDir: "allure-results",
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
        },
      }
    ],
  ],

  use: {

    viewport: { width: 1280, height: 720 },
    baseURL: "http://localhost:4200",
    trace: "on-first-retry",
    testIdAttribute: "data-test",
    screenshot: "only-on-failure",
    video: {
      mode: "on-first-retry",
      size: { width: 1280, height: 720 },
    },
    actionTimeout: 16000,
    navigationTimeout: 16000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: "globalsQaApp.spec.ts"
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: "globalsQaApp.spec.ts",
    },
    {
      name: "mobile",
      use: { ...devices["Galaxy S9+"] },
      testMatch: "003-pwTestApp.spec.ts"
    },
  ],
  outputDir: "test-results/",

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 120000
  },
});
