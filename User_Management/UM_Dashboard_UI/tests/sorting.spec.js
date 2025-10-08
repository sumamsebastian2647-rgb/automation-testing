const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Admin Table Sorting Tests', () => {
  let dashboard;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);

    dashboard = new DashboardPage(page);
    await dashboard.openUserManagement();
  });
  //////////////////////////////////////////////////////
test('Verify Name column sorting A-Z and Z-A', async ({ page }) => {
  const columnCells = page.locator('table tbody tr td:nth-child(2)');
  const normalize = arr => arr.map(v => v.trim());

  // A-Z: click header
  console.log('Clicking Name header for A-Z sort...');
  const nameHeaderSelector = 'table thead tr th:nth-child(2) a';
  await page.locator(nameHeaderSelector).click();
  await columnCells.first().waitFor({ state: 'visible' });

  // Verify A-Z
  let uiValues = normalize(await columnCells.allTextContents());
  let sortedAsc = [...uiValues].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  console.log('UI values after A-Z sort:', uiValues);
  expect(uiValues).toEqual(sortedAsc);
  console.log('A-Z sort verified ✅');

  // Store first cell value to detect changes
  const firstCellBefore = await columnCells.first().innerText();
  console.log('First cell before Z-A sort:', firstCellBefore);
  
  // Z-A: Click for descending order
  console.log('Clicking Name header again for Z-A sort...');
  await page.waitForTimeout(1000); // Wait for UI to stabilize
  
  // Click using position-based selector
  await page.locator(nameHeaderSelector).click();
  
  // ⚠️ FIXED: waitForFunction without using page object inside the callback
  console.log('Waiting for table to update...');
  await page.waitForFunction(
    (oldText) => {
      // This runs in browser context - can't use page object here
      const currentFirstCell = document.querySelector('table tbody tr td:nth-child(2)').innerText;
      return currentFirstCell.trim() !== oldText.trim();
    },
    firstCellBefore,  // Pass the value as an argument
    { timeout: 10000 }
  );

  // Verify Z-A
  uiValues = normalize(await columnCells.allTextContents());
  let sortedDesc = [...uiValues].sort((a, b) =>
    b.localeCompare(a, undefined, { sensitivity: 'base' })
  );
  console.log('UI values after Z-A sort:', uiValues);
  expect(uiValues).toEqual(sortedDesc);
  console.log('Z-A sort verified ✅');
});
//////////////////////////////////////////////////////
test('Verify Username column sorting A-Z and Z-A', async ({ page }) => {
  const columnCells = page.locator('table tbody tr td:nth-child(2)');
  const normalize = arr => arr.map(v => v.trim());

  // A-Z: click header
  console.log('Clicking Username header for A-Z sort...');
  let usernameHeader = page.locator('a[data-sort="username"]'); // Confirmed correct
  await usernameHeader.click();
  await columnCells.first().waitFor({ state: 'visible' });

  // Verify A-Z
  let uiValues = normalize(await columnCells.allTextContents());
  let sortedAsc = [...uiValues].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  console.log('UI values after A-Z sort:', uiValues);
  expect(uiValues).toEqual(sortedAsc);
  console.log('A-Z sort verified ✅');

  // Store first cell value to detect changes
  const firstCellBefore = await columnCells.first().innerText();
  
  // Z-A: click header again for descending
  console.log('Clicking Username header again for Z-A sort...');
  await page.waitForTimeout(1000); // Wait for UI to stabilize
  await usernameHeader.click();
  
  // Wait for table update
  console.log('Waiting for table to update...');
  await page.waitForFunction(
    (oldText) => {
      const currentFirstCell = document.querySelector('table tbody tr td:nth-child(2)').innerText;
      return currentFirstCell.trim() !== oldText.trim();
    },
    firstCellBefore,
    { timeout: 10000 }
  );

  // Verify Z-A
  uiValues = normalize(await columnCells.allTextContents());
  let sortedDesc = [...uiValues].sort((a, b) =>
    b.localeCompare(a, undefined, { sensitivity: 'base' })
  );
  console.log('UI values after Z-A sort:', uiValues);
  expect(uiValues).toEqual(sortedDesc);
  console.log('Z-A sort verified ✅');
});


});
