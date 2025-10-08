const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { ExportPage } = require('./pages/ExportPage');
const { VerifyPagination } = require('./pages/VerifyPagination');


// Reusable login before each test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');

 
 
});



test('Verify Pagination in User Management', async ({ page }) => {
  const userMgmtPage = new VerifyPagination(page);
  await userMgmtPage.navigateToUserManagement();
  await userMgmtPage.setPageSize(5);
  await userMgmtPage.verifyPagination();
});
