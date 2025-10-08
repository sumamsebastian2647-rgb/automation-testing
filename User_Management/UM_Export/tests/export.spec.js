// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { ExportPage } = require('./pages/ExportPage');


// Reusable login before each test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');

  const exportPage = new ExportPage(page);
  await exportPage.navigateToCreateAdmin();
  console.log('navigated to create admin page');
});

// ✅ Test Export as PDF
test('Export as PDF', async ({ page }) => {
  const exportPage = new ExportPage(page);
  await exportPage.exportaspdf();
  await exportPage.verifyExportPDF();
});

// ✅ Test Export as Excel
test('Export as Excel', async ({ page }) => {
  const exportPage = new ExportPage(page);
  await exportPage.exportasexcel();
  await exportPage.verifyExportxls();
});

// ✅ Test Export as CSV
test('Export as CSV', async ({ page }) => {
  const exportPage = new ExportPage(page);
  await exportPage.exportascsv();
  await exportPage.verifyExportcsv();
});

// ✅ Test Export as JSON
test('Export as JSON', async ({ page }) => {
  const exportPage = new ExportPage(page);
  await exportPage.exportasjson();
  await exportPage.verifyExportjson();
});