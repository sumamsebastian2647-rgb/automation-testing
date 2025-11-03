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
test('Reorder Email and Phone Number columns with logging in active trainer', async ({ page }) => {
  const columnPage = new ColumnSettingsPage(page);
  await columnPage.navigateToTrainerManagement();
  await columnPage.openVisibleColumns();
  // ✅ Get current column order BEFORE any changes
  const currentOrder = await columnPage.getColumnOrder();
  console.log('📄 Current visible columns order BEFORE reorder:', currentOrder);
  // Swap Email and Phone Number
  await columnPage.reorderColumns('Email', 'Mobile');
  // Apply changes
  await columnPage.applyChanges();
  await page.waitForTimeout(2000);
  await columnPage.navigateToTrainerManagement();
  console.log('succesfully reordered columns');
});

test('Reorder Email and Username columns with logging in inactive trainer', async ({ page }) => {
  const columnPage = new ColumnSettingsPage(page);
  await columnPage.navigateToTrainerManagement_inactive();
  await columnPage.openVisibleColumns();
  // ✅ Get current column order BEFORE any changes
  const currentOrder = await columnPage.getColumnOrder();
  console.log('📄 Current visible columns order BEFORE reorder:', currentOrder);
  // Swap Email and Phone Number
  await columnPage.reorderColumns('Email', 'Username');
  // Apply changes
  await columnPage.applyChanges();
  await page.waitForTimeout(2000);
  await columnPage.navigateToTrainerManagement();
  console.log('succesfully reordered columns');
});