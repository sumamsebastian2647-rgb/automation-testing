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
test('Hide and Unhide Phone Number column', async ({ page }) => {
  const columnPage = new ColumnSettingsPage(page);

  // Navigate to User Management
  await columnPage.navigateToUserManagement();

  // Print table headers BEFORE
  const headersBefore = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers BEFORE hiding column:', headersBefore);

  // Open column settings panel
  await columnPage.openVisibleColumns();

  // Drag Phone Number to hidden
  await columnPage.dragColumnToHidden('Phone Number');
  await page.waitForTimeout(2000);
  // Optional: print hidden columns before apply
  const hiddenColumnsBefore = await page.locator('ul.sortable-hidden li').allInnerTexts();
  console.log('📦 Hidden Columns BEFORE apply:', hiddenColumnsBefore);

  // Apply changes and wait for table reload
  await columnPage.applyChangesAndWait();
 await page.waitForTimeout(2000);
  // Print table headers AFTER
  const headersAfter = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers AFTER hiding Phone Number:', headersAfter);

  // Verify column visibility
  await columnPage.verifyColumnVisibility(
    headersAfter.filter(h => h !== 'Phone Number'),
    ['Phone Number']
  );

  // --- Optional: Unhide Phone Number ---
  await columnPage.openVisibleColumns();
  await columnPage.dragColumnToVisible('Phone Number');
  await columnPage.applyChangesAndWait();

  const headersFinal = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers AFTER unhiding Phone Number:', headersFinal);
});
  /*test('Unhide Phone Number column and verify', async ({ page }) => {
    const columnPage = new ColumnSettingsPage(page);
    await columnPage.navigateToUserManagement();+
    // Open visible columns panel
    await columnPage.openVisibleColumns();

    // Drag "Phone Number" back to visible list
    const source = page.locator('ul.sortable-hidden li[draggable="true"]', { hasText: 'Phone Number' });
    const target = page.locator('ul.sortable-visible li.alert.alert-info.dynagrid-sortable-header.disabled');
    await source.dragTo(target);

    // Apply changes and wait
    await columnPage.applyChangesAndWait();

    // Verify Phone Number is visible again
    const headers = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
    console.log('📄 Table headers AFTER unhiding Phone Number:', headers);

    await columnPage.verifyColumnVisibility(
      ['Phone Number', ...headers.filter(h => h !== 'Phone Number')],
      []
    );
  });*/
