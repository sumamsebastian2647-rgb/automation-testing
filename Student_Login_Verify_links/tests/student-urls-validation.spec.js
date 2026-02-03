const { test, expect } = require('@playwright/test');
const { StudentUrlCollector } = require('./pages/StudentUrlCollector');
const { LoginPage } = require('./pages/LoginPage');
const config = require('../config');
const { logPage } = require('../utils/reportSteps');
const { logStep } = require('../utils/reportCollector');
const { generateHtmlReport } = require('../utils/htmlReportWriter');

test.describe('Student Collected URLs - Automated Validation', () => {
  // Allow enough time to visit all collected URLs
  test.setTimeout(10 * 60 * 1000); // 10 minutes

  let urls = [];
  let context;
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    // Create our own context/page for reuse across tests
    context = await browser.newContext();
    sharedPage = await context.newPage();

    // 1. Login once as student
    const loginPage = new LoginPage(sharedPage);
    await loginPage.goto();
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );
    await sharedPage.waitForLoadState('networkidle');
    await logPage(sharedPage, 'Student Dashboard - URL Validation Start');

    // 2. Load collected URLs from file via StudentUrlCollector
    const collector = new StudentUrlCollector(sharedPage);
    urls = collector.loadCollectedUrls();

    console.log(`\n📂 Loaded ${urls.length} collected URLs for validation\n`);

    if (!urls || urls.length === 0) {
      console.warn('⚠️ No collected URLs found. Make sure you ran the collector test first.');
    }
  });

  test('Visit each collected URL and verify it loads', async () => {
    if (!urls || urls.length === 0) {
      test.skip();
    }

    const page = sharedPage;

    for (const urlInfo of urls) {
      // Rebuild URL with the current environment baseOrigin (so JSON from test env works in prod/stage)
      const url = `${config.credentials.baseOrigin}${urlInfo.pathname || ''}${urlInfo.search || ''}`;

      console.log(`\n🔗 Visiting: ${url} (${urlInfo.title || 'No title'})`);

      let statusLabel = 'SUCCESS';
      let responseStatus = 'N/A';
      let toastText = 'N/A';
      let note = '';

      // Navigate to the URL
      let response;
      try {
        response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (error) {
        statusLabel = 'FAIL';
        note = `Navigation error: ${error.message}`;
      }

      if (response) {
        responseStatus = response.status();
        console.log(`   HTTP status: ${responseStatus}`);
        if (responseStatus >= 400) {
          statusLabel = 'FAIL';
          note = `HTTP ${responseStatus}`;
        }
      } else if (!note) {
        note = 'No response object returned by page.goto';
      }

      const currentUrl = page.url();
      console.log(`   Final URL: ${currentUrl}`);

      // Detect redirect back to login
      if (currentUrl.includes('/site/login')) {
        statusLabel = 'FAIL';
        note = note ? `${note}; Redirected to login` : 'Redirected to login';
      }

      // Try to capture toast message if present
      try {
        const toastLocator = page.locator('span[data-notify="message"], .toast-message');
        await toastLocator.waitFor({ timeout: 3000 });
        toastText = (await toastLocator.innerText()).trim();
        note = note || 'Toast captured';
      } catch {
        // no toast
      }

      // Optional: small wait so the page can stabilise
      await page.waitForTimeout(500);

      // Log the result
      logStep({
        pageName: urlInfo.title || urlInfo.pathname || 'URL',
        url,
        action: 'URL VISIT',
        toast: toastText,
        status: statusLabel,
        responseStatus,
        note: note || 'OK'
      });

      // Assert to fail the test if this URL failed
      expect(statusLabel).toBe('SUCCESS');
    }
  });

  test.afterAll(async () => {
    generateHtmlReport();
    await context?.close();
  });
});

