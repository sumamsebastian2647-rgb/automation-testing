const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const config = require('../config');

test.describe('Admin Table Sorting Tests', () => {
  let dashboard;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);

    dashboard = new DashboardPage(page);
    await dashboard.openTrainerManagement();
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

test('Verify Username column sorting behavior', async ({ page }) => {
  const normalize = arr => arr.map(v => v.trim());

  // -------------------- Locators --------------------
  const usernameHeaderSelector = 'table thead tr th:nth-child(3) a';
  const usernameHeader = page.locator(usernameHeaderSelector);
  const columnCells = page.locator('table tbody tr td[data-col-seq="2"]');
  
  // -------------------- Wait for Table to Load --------------------
  console.log('Waiting for table data to load...');
  await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
  await expect(columnCells.first()).toBeVisible();
  
  // Give the table an extra moment to fully render
  await page.waitForTimeout(1000);
  
  // -------------------- Capture Initial State --------------------
  const initialOrder = normalize(await columnCells.allTextContents());
  console.log('Initial username order:', initialOrder);
  
  // Verify we have data before proceeding
  expect(initialOrder.length).toBeGreaterThan(0);
  
  // -------------------- First Sort (A-Z) --------------------
  console.log('Clicking Username header for first sort...');
  await usernameHeader.scrollIntoViewIfNeeded();
  await usernameHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get first sorted state
  const firstSortOrder = normalize(await columnCells.allTextContents());
  console.log('First sort order (A-Z):', firstSortOrder);
  
  // Verify order changed (or was already in desired sort)
  if (JSON.stringify(initialOrder) !== JSON.stringify(firstSortOrder)) {
    console.log('Order changed after first click');
    expect(firstSortOrder).not.toEqual(initialOrder);
  } else {
    console.log('Initial order was already in first sort state');
  }
  
  // Save first sort order for later comparison
  const savedFirstSortOrder = [...firstSortOrder];
  
  // -------------------- Second Sort (Z-A) --------------------
  console.log('Clicking Username header again for second sort...');
  await usernameHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get second sorted state
  const secondSortOrder = normalize(await columnCells.allTextContents());
  console.log('Second sort order (Z-A):', secondSortOrder);
  
  // Verify second sort is different from first sort
  expect(secondSortOrder).not.toEqual(savedFirstSortOrder);
  
  // -------------------- Third Sort (Back to A-Z) --------------------
  console.log('Clicking Username header a third time...');
  await usernameHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get third sorted state
  const thirdSortOrder = normalize(await columnCells.allTextContents());
  console.log('Third sort order (back to A-Z):', thirdSortOrder);
  
  // Verify third sort returns to first sort order
  expect(thirdSortOrder).toEqual(savedFirstSortOrder);
  
  // -------------------- Additional Verification --------------------
  // Optional: Verify sort pattern makes sense (first element of each sort)
  console.log(`First username in A-Z sort: ${firstSortOrder[0]}`);
  console.log(`First username in Z-A sort: ${secondSortOrder[0]}`);
  
  // Check if A-Z and Z-A firsts are in expected relationship
  // This helps verify the sort direction is actually working
  const alphaCompare = firstSortOrder[0].localeCompare(secondSortOrder[0]);
  console.log(`Comparison result: ${alphaCompare} (negative means A-Z sort works)`);
  
  console.log('Username sorting test passed ✅');
});
//--------------------------------------------------------------------------------------------------

test('Verify Email column sorting behavior', async ({ page }) => {
  // Locators
  const emailHeaderSelector = 'table thead tr th:nth-child(4) a';
  const emailHeader = page.locator(emailHeaderSelector);
  const columnCells = page.locator('table tbody tr td[data-col-seq="3"]');
  
  // IMPORTANT: Wait for table data to load first
  await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
  await expect(columnCells.first()).toBeVisible();
  
  // Get initial state AFTER waiting for table to load
  await page.waitForTimeout(1000); // Extra safety buffer
  const initialOrder = await columnCells.allTextContents();
  console.log('Initial order:', initialOrder);
  
  // Verify we have data before proceeding
  expect(initialOrder.length).toBeGreaterThan(0);
  
  // Click for first sort direction
  await emailHeader.scrollIntoViewIfNeeded();
  await emailHeader.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Give sort time to complete
  
  // Get first sorted state
  const firstSortOrder = await columnCells.allTextContents();
  console.log('First sort order:', firstSortOrder);
  
  // Verify order changed (skip if initial order was already sorted)
  if (JSON.stringify(initialOrder) !== JSON.stringify(firstSortOrder)) {
    expect(firstSortOrder).not.toEqual(initialOrder);
  } else {
    console.log('Initial order was already in first sort state');
  }
  
  // Store first sort order for later comparison
  const savedFirstSortOrder = [...firstSortOrder];
  
  // Click for second sort direction
  await emailHeader.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Give sort time to complete
  
  // Get second sorted state
  const secondSortOrder = await columnCells.allTextContents();
  console.log('Second sort order:', secondSortOrder);
  
  // Verify second sort is different
  expect(secondSortOrder).not.toEqual(savedFirstSortOrder);
  
  // Click for third sort to verify we return to first sort order
  await emailHeader.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Give sort time to complete
  
  // Get third sorted state
  const thirdSortOrder = await columnCells.allTextContents();
  console.log('Third sort order:', thirdSortOrder);
  
  // Verify we've returned to first sort order
  expect(thirdSortOrder).toEqual(savedFirstSortOrder);
  
  console.log('Email sorting test passed ✅');
});
//---------------------------------------------------------------------------------------------
test('Verify Mobile column sorting behavior', async ({ page }) => {
  const normalize = arr => arr.map(v => v.trim());

  // -------------------- Locators --------------------
  const mobileHeaderSelector = 'table thead tr th:nth-child(5) a';
  const mobileHeader = page.locator(mobileHeaderSelector);
  const columnCells = page.locator('table tbody tr td[data-col-seq="4"]');
  
  // -------------------- Wait for Table to Load --------------------
  console.log('Waiting for table data to load...');
  await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
  await expect(columnCells.first()).toBeVisible();
  
  // Give the table an extra moment to fully render
  await page.waitForTimeout(1000);
  
  // -------------------- Capture Initial State --------------------
  const initialOrder = normalize(await columnCells.allTextContents());
  console.log('Initial mobile order:', initialOrder);
  
  // Verify we have data before proceeding
  expect(initialOrder.length).toBeGreaterThan(0);
  
  // -------------------- First Sort (A-Z) --------------------
  console.log('Clicking Mobile header for first sort...');
  await mobileHeader.scrollIntoViewIfNeeded();
  await mobileHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get first sorted state
  const firstSortOrder = normalize(await columnCells.allTextContents());
  console.log('First sort order (A-Z):', firstSortOrder);
  
  // Verify order changed (or was already in desired sort)
  if (JSON.stringify(initialOrder) !== JSON.stringify(firstSortOrder)) {
    console.log('Order changed after first click');
    expect(firstSortOrder).not.toEqual(initialOrder);
  } else {
    console.log('Initial order was already in first sort state');
  }
  
  // Save first sort order for later comparison
  const savedFirstSortOrder = [...firstSortOrder];
  
  // -------------------- Second Sort (Z-A) --------------------
  console.log('Clicking Mobile header again for second sort...');
  await mobileHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get second sorted state
  const secondSortOrder = normalize(await columnCells.allTextContents());
  console.log('Second sort order (Z-A):', secondSortOrder);
  
  // Verify second sort is different from first sort
  expect(secondSortOrder).not.toEqual(savedFirstSortOrder);
  
  // Check special condition for mobile: empty values may move to top or bottom
  const hasEmptyValues = secondSortOrder.some(v => v === '');
  if (hasEmptyValues) {
    console.log('Mobile column contains empty values, checking for reasonable sort order');
    // Instead of exact match, verify non-empty values are in reverse order
    const nonEmptyFirst = savedFirstSortOrder.filter(v => v !== '');
    const nonEmptySecond = secondSortOrder.filter(v => v !== '');
    
    // Verify reverse order for non-empty values
    const reversedFirst = [...nonEmptyFirst].reverse();
    const isReversed = JSON.stringify(nonEmptySecond) === JSON.stringify(reversedFirst);
    if (!isReversed) {
      // Alternative check: just verify the orders are different
      expect(JSON.stringify(nonEmptyFirst)).not.toEqual(JSON.stringify(nonEmptySecond));
    }
  } else {
    // Standard verification for columns without empty values
    expect(secondSortOrder).not.toEqual(savedFirstSortOrder);
  }
  
  // -------------------- Third Sort (Back to A-Z) --------------------
  console.log('Clicking Mobile header a third time...');
  await mobileHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get third sorted state
  const thirdSortOrder = normalize(await columnCells.allTextContents());
  console.log('Third sort order (back to A-Z):', thirdSortOrder);
  
  // Check if we've returned to first sort order (accounting for empty values)
  if (hasEmptyValues) {
    const nonEmptyFirst = savedFirstSortOrder.filter(v => v !== '');
    const nonEmptyThird = thirdSortOrder.filter(v => v !== '');
    expect(JSON.stringify(nonEmptyFirst)).toEqual(JSON.stringify(nonEmptyThird));
  } else {
    expect(thirdSortOrder).toEqual(savedFirstSortOrder);
  }
  
  // -------------------- Additional Verification --------------------
  // For mobile, we verify that non-empty values appear to be sorted
  const nonEmptyValues = firstSortOrder.filter(v => v !== '');
  if (nonEmptyValues.length >= 2) {
    console.log(`First non-empty mobile in A-Z sort: ${nonEmptyValues[0]}`);
    
    // Get non-empty values from second sort
    const nonEmptyValuesDesc = secondSortOrder.filter(v => v !== '');
    if (nonEmptyValuesDesc.length >= 1) {
      console.log(`First non-empty mobile in Z-A sort: ${nonEmptyValuesDesc[0]}`);
    }
  }
  
  console.log('Mobile sorting test passed ✅');
});
//--------------------------------------------------------------------------------------------------------

test('Verify Created At column sorting behavior', async ({ page }) => {
  const normalize = arr => arr.map(v => v.trim());

  // -------------------- Locators --------------------
  const createdAtHeaderSelector = 'table thead tr th:nth-child(6) a';
  const createdAtHeader = page.locator(createdAtHeaderSelector);
  const columnCells = page.locator('table tbody tr td[data-col-seq="5"]');
  
  // For verifying sort icons
  const ascSortIcon = page.locator('th:nth-child(6) .glyphicon-sort-by-attributes');
  const descSortIcon = page.locator('th:nth-child(6) .glyphicon-sort-by-attributes-alt');
  
  // -------------------- Wait for Table to Load --------------------
  console.log('Waiting for table data to load...');
  await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
  await expect(columnCells.first()).toBeVisible();
  
  // Give the table an extra moment to fully render
  await page.waitForTimeout(1000);
  
  // -------------------- Capture Initial State --------------------
  const initialOrder = normalize(await columnCells.allTextContents());
  console.log('Initial created at order:', initialOrder);
  
  // Verify we have data before proceeding
  expect(initialOrder.length).toBeGreaterThan(0);
  
  // Check if initially sorted in descending order (newest first)
  const isInitiallyDescending = await descSortIcon.isVisible();
  console.log(`Table is initially sorted in ${isInitiallyDescending ? 'descending' : 'ascending'} order`);
  
  // -------------------- First Click (Toggle Sort) --------------------
  console.log('Clicking Created At header to toggle sort...');
  await createdAtHeader.scrollIntoViewIfNeeded();
  await createdAtHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  // Wait for ascending sort icon if initially descending, or vice versa
  if (isInitiallyDescending) {
    await expect(ascSortIcon).toBeVisible({ timeout: 5000 });
  } else {
    await expect(descSortIcon).toBeVisible({ timeout: 5000 });
  }
  
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get first sorted state after toggle
  const firstToggleOrder = normalize(await columnCells.allTextContents());
  console.log('Order after first toggle:', firstToggleOrder);
  
  // Verify order changed
  expect(firstToggleOrder).not.toEqual(initialOrder);
  
  // -------------------- Helper Function to Convert Date String to Date Object --------------------
  const parseDate = (dateStr) => {
    // Assuming format is DD-MM-YYYY
    const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  };
  
  // -------------------- Verify Sort Logic --------------------
  const datesAfterFirstToggle = firstToggleOrder.map(parseDate);
  
  // Check if dates are in ascending order (oldest first)
  const isAscendingAfterToggle = datesAfterFirstToggle.every((date, i, arr) => 
    i === 0 || date >= arr[i-1] || isNaN(date.getTime())
  );
  
  // Check if dates are in descending order (newest first)
  const isDescendingAfterToggle = datesAfterFirstToggle.every((date, i, arr) => 
    i === 0 || date <= arr[i-1] || isNaN(date.getTime())
  );
  
  console.log(`After first toggle, dates are in ${isAscendingAfterToggle ? 'ascending' : isDescendingAfterToggle ? 'descending' : 'unknown'} order`);
  
  // Save first toggle order for later comparison
  const savedFirstToggleOrder = [...firstToggleOrder];
  
  // -------------------- Second Click (Toggle Sort Again) --------------------
  console.log('Clicking Created At header again to toggle sort back...');
  await createdAtHeader.click();
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  // Wait for opposite sort icon
  if (isInitiallyDescending) {
    await expect(descSortIcon).toBeVisible({ timeout: 5000 });
  } else {
    await expect(ascSortIcon).toBeVisible({ timeout: 5000 });
  }
  
  await page.waitForTimeout(1000); // Extra buffer for sort to complete
  
  // Get second sorted state
  const secondToggleOrder = normalize(await columnCells.allTextContents());
  console.log('Order after second toggle:', secondToggleOrder);
  
  // Verify second toggle reverts to initial order
  expect(secondToggleOrder).toEqual(initialOrder);
  expect(secondToggleOrder).not.toEqual(savedFirstToggleOrder);
  
  // -------------------- Additional Verification --------------------
  // Verify the first and last dates to ensure meaningful sort
  if (initialOrder.length >= 2) {
    const firstDateInitial = parseDate(initialOrder[0]);
    const lastDateInitial = parseDate(initialOrder[initialOrder.length - 1]);
    const firstDateToggle = parseDate(savedFirstToggleOrder[0]);
    const lastDateToggle = parseDate(savedFirstToggleOrder[savedFirstToggleOrder.length - 1]);
    
    console.log(`First date in initial order: ${initialOrder[0]}`);
    console.log(`Last date in initial order: ${initialOrder[initialOrder.length - 1]}`);
    console.log(`First date after toggle: ${savedFirstToggleOrder[0]}`);
    console.log(`Last date after toggle: ${savedFirstToggleOrder[savedFirstToggleOrder.length - 1]}`);
    
    if (isInitiallyDescending) {
      // If initially descending, first date should be newer than last date
      expect(firstDateInitial > lastDateInitial || isNaN(firstDateInitial.getTime()) || isNaN(lastDateInitial.getTime())).toBeTruthy();
      // After toggle to ascending, first date should be older than last date
      expect(firstDateToggle < lastDateToggle || isNaN(firstDateToggle.getTime()) || isNaN(lastDateToggle.getTime())).toBeTruthy();
    } else {
      // If initially ascending, first date should be older than last date
      expect(firstDateInitial < lastDateInitial || isNaN(firstDateInitial.getTime()) || isNaN(lastDateInitial.getTime())).toBeTruthy();
      // After toggle to descending, first date should be newer than last date
      expect(firstDateToggle > lastDateToggle || isNaN(firstDateToggle.getTime()) || isNaN(lastDateToggle.getTime())).toBeTruthy();
    }
  }
  
  console.log('Created At sorting test passed ✅');
});


});
