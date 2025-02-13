import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: 1,
  reporter: 'html',
  use: {
    viewport: { width: 1280, height: 720 },
    baseURL: "http://localhost:4200",
    testIdAttribute: "data-test",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results/",

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 120000
  },
});
