// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300 * 1000, // 5 min timeout per test
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI, // Prevent accidental .only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Force single worker in CI
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'html',

  use: {
    baseURL: 'https://rto2503.cloudemy.au',
    trace: 'on-first-retry',
    headless: true, // Headless is recommended in CI
    browserName: 'chromium', // ✅ Chromium only
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: '1-newenrollment',
      testMatch: 'tests/newenrollment.spec.js',
      use: { browserName: 'chromium' }, // Redundant but explicit
    },
    {
      name: 'create-spec-test',
      testMatch: 'tests/create.spec.js',
      use: { browserName: 'chromium' },
    }
  ],

  outputDir: 'test-results/',
});
