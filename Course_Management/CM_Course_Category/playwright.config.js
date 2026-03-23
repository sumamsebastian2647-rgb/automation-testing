// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // retry flaky tests once locally

  /* Workers */
  workers: process.env.CI ? 1 : 4, // adjust based on your CPU

  /* Reporter */
  reporter: 'html',

  /* Shared settings for all projects */
  use: {
    headless: true, // always run headless for faster and stable runs
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000, // timeout for actions like click/fill
    navigationTimeout: 30000, // timeout for page.goto
    trace: 'on-first-retry', // collect trace on retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment if you want cross-browser
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  /* Optional: start local dev server before tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
