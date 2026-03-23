const { test } = require('@playwright/test');
const DashboardPage = require('./pages/DashboardPage');
const { LoginPage } = require('./pages/LoginPage');
const config = require('../config');
const { logPage, logToast } = require('../utils/reportSteps');
const { generateHtmlReport } = require('../utils/htmlReportWriter');

test.describe('Dashboard Feature Tests', () => {
  let dashboardPage;

  // 🔐 Login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    dashboardPage = new DashboardPage(page);
    await dashboardPage.closeDashboardModalIfVisible();

    // ✅ LOG: Dashboard page visited
    await logPage(page, 'Dashboard');
  });

  // 📊 Generate HTML report once after all tests
  test.afterAll(() => {
    generateHtmlReport();
  });

  // ❌ Keep your failure handling (no report mixing here)
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const dashboard = new DashboardPage(page);

      try {
        const toastMessage = await dashboard.getToastMessage();
        console.log('❌ Toast Message:', toastMessage);

        // OPTIONAL: log failed toast in report
        await logToast(page, 'Dashboard', testInfo.title);
      } catch {
        console.log('⚠️ No toast message found');
      }

      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
        fullPage: true
      });
    }
  });

  test('1. Verify Top Menu', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.topMenuNavigation();

    // (No toast expected → no logToast needed)
  });

  /*
  test('2. Verify Courses', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.coursesFlow();
    await logToast(page, 'Dashboard', 'Courses Flow');
  });

  test('3. Verify Left Menu', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.leftMenuFlow();
  });

  test('4. Verify Certificates', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.certificatesFlow();
    await logToast(page, 'Certificates', 'Certificate Navigation');
  });

  test('5. Verify Dashboard Widgets', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.dashboardWidgets();
  });

  test('6. Verify Header Links', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.headerLinks();
  });

  test('7. Verify Logout', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.logout();
    await logToast(page, 'Dashboard', 'Logout');
  });
  */
});
