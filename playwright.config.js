// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300 * 1000, // 5 min timeout per test
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'html',

  use: {
    baseURL: 'https://rto2503.cloudemy.au',
    trace: 'on-first-retry',
    headless: true,
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'new-enrollment',
      testDir: './tests/new-enrollment',
      use: { browserName: 'chromium' },
    },
    {
      name: 'existing-enrollment',
      testDir: './tests/existing-enrollment',
      use: { browserName: 'chromium' },
    },
    {
      name: 'international-enrollment',
      testDir: './tests/international-enrollment',
      use: { 
        browserName: 'chromium',
        actionTimeout: 20000,
        navigationTimeout: 30000
      },
    }
  ],

  outputDir: 'test-results/',
});
