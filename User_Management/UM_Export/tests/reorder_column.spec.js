// ./tests/columnSettings.spec.js
const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { ColumnSettingsPage } = require('./pages/ColumnSettingsPage');

// Reusable login before each test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');
});



 //🔹 Test 2: Change Column Order
test('Reorder Email and Phone Number columns with logging', async ({ page }) => {
  const columnPage = new ColumnSettingsPage(page);
  await columnPage.navigateToUserManagement();
  await columnPage.openVisibleColumns();
  // ✅ Get current column order BEFORE any changes
  const currentOrder = await columnPage.getColumnOrder();
  console.log('📄 Current visible columns order BEFORE reorder:', currentOrder);
  // Swap Email and Phone Number
  await columnPage.reorderColumns('Email', 'Phone Number');
  // Apply changes
  await columnPage.applyChanges();
  await page.waitForTimeout(2000);
  await columnPage.navigateToUserManagement();
  console.log('succesfully reordered columns');
});
