const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { ColumnSettingsPage } = require('./pages/ColumnSettingsPage');
test.describe.serial('Grid setting-hide&unhide', () => {
   test.use({ timeout: 6000000 }); 
    let dashboardPage;
     let page;
     // ✅ Login once and navigate to Work Experience before all tests
     test.beforeAll(async ({ browser }) => {
       page = await browser.newPage();
       const loginPage = new LoginPage(page);
       await loginPage.goto();
       await loginPage.login(config.credentials.username, config.credentials.password);
       await page.waitForLoadState('networkidle');
    
     });
     // ✅ Close after all tests
     test.afterAll(async () => {
       await page.close();
     });
  
 // Test 1: Hide "Mobile" column in Active Trainers
test('Hide Mobile column in Active Trainers', async () => {
  const columnPage = new ColumnSettingsPage(page);

  // Navigate to Active Trainers
  await columnPage.navigateToTrainerManagement();

  // Print headers before hiding
  const headersBefore = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers BEFORE hiding Mobile:', headersBefore);

  // Open column settings panel
await columnPage.openVisibleColumns();

// Hide "Mobile"
await columnPage.dragColumn('Mobile', false);

// ✅ Print hidden columns immediately after drag
const hiddenColumnsAfterDrag = await page.locator('ul.sortable-hidden li').allInnerTexts();
console.log('📦 Hidden columns AFTER dragging Mobile:', hiddenColumnsAfterDrag);

// Apply changes and wait for table update
await columnPage.applyChangesAndWait();

// --- NEW: close the settings panel to trigger table refresh ---
await columnPage.closeSettingsPanel();

// Optional: wait a little to ensure table redraws
await page.waitForTimeout(1500);

// Print headers after hiding
const headersAfterHide = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
console.log('📄 Table headers AFTER hiding Mobile:', headersAfterHide);

});

// Test 2: Unhide "Mobile" column in Active Trainers
test('Unhide Mobile column in Active Trainers', async () => {
  const columnPage = new ColumnSettingsPage(page);

  await columnPage.navigateToTrainerManagement();

  const headersBefore = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers BEFORE unhiding Mobile:', headersBefore);

  await columnPage.openVisibleColumns();

  // Unhide "Mobile"
  await columnPage.dragColumn('Mobile', true);

  // ✅ Print visible columns immediately after drag
  const visibleColumnsAfterDrag = await page.locator('ul.sortable-visible li').allInnerTexts();
  console.log('📦 Visible columns AFTER dragging Mobile back:', visibleColumnsAfterDrag);

  await columnPage.applyChangesAndWait();
  await columnPage.closeSettingsPanel();        // close modal
  //await page.waitForResponse(resp => resp.url().includes('/save-columns') && resp.status() === 200);

  const headersAfterUnhide = await page.locator('table thead tr:not(.filters) th').allInnerTexts();
  console.log('📄 Table headers AFTER unhiding Mobile:', headersAfterUnhide);

  await columnPage.verifyColumnVisibility(
    ['Mobile', ...headersAfterUnhide.filter(h => h !== 'Mobile')],
    []
  );
});

 });
