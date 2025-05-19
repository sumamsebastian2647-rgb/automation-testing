// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://rto2503.cloudemy.au',
    trace: 'on-first-retry',
    headless: false,
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  /* Ensure files run in this order via naming */
  projects: [
    {
      name: '1-newenrollment',
      testMatch: 'tests/newenrollment.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '2-existingstudent',
      testMatch: 'tests/existingstudent.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '3-start-new',
      testMatch: 'tests/start_new.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results/',
});
