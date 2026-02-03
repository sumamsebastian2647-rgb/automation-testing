// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');

const config = require('../config');

// --- Sorting Utilities ---
const {
  getColumnValues,
  takeScreenshot,
  getSortStatus,
  getSortLinkUrl,
  waitForSortUpdate,
  verifySorting,
  verifyReverseSorting,
  isNaturallySorted
} = require('./pages/sort-utils');

// --- Date Sorting Utilities ---
const {
  isDateSortedDescending,
  isDateSortedAscending,
  getDateValues,
  takeScreenshot1,
  waitForSortUpdate1,
  getSortLinkAttribute
} = require('./pages/date_sort');

test.describe('Course Management - Active & Inactive Category Sorting Tests', () => {
  let dashboardPage;
  let dashboardPage1;

// --- Login before each test ---
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
  
    await dashboardPage.navigateToCourseCategory();
  });

  // ───────────────────────────────
  // ACTIVE CATEGORY SORTING BY NAME
  // ───────────────────────────────
  test('Active dashboard - Category Name sorting', async ({ page }) => {
    console.log('Navigating to the active categories page...');
    await page.waitForSelector('.kv-grid-table', { state: 'visible' });

    await takeScreenshot(page, 'active-before-sorting.png');

    const sortLinkSelector = 'th[data-col-seq="1"] a.kv-sort-link, a[data-sort="cat_name"]';
    await page.waitForSelector(sortLinkSelector, { state: 'visible' });
    await page.click(sortLinkSelector);
    await waitForSortUpdate(page);

    const firstClickCategories = await getColumnValues(page, 'cat_name');
    console.log('Categories after first click:', firstClickCategories);

    const isAZ = verifySorting(firstClickCategories);
    const isZA = verifyReverseSorting(firstClickCategories);

    if (isAZ) {
      console.log('✅ First click sorted A-Z, verifying Z-A...');
      await page.click(sortLinkSelector);
      await waitForSortUpdate(page);
      const secondClickCategories = await getColumnValues(page, 'cat_name');
      expect(verifyReverseSorting(secondClickCategories)).toBeTruthy();
    } else if (isZA) {
      console.log('✅ First click sorted Z-A, verifying A-Z...');
      await page.click(sortLinkSelector);
      await waitForSortUpdate(page);
      const secondClickCategories = await getColumnValues(page, 'cat_name');
      expect(verifySorting(secondClickCategories)).toBeTruthy();
    } else {
      console.log('❌ Unknown sort pattern detected.');
      await takeScreenshot(page, 'active-sorting-failed.png');
      const natural = isNaturallySorted(firstClickCategories);
      expect(natural).toBeTruthy();
    }

    console.log('✅ Active category sorting test completed.');
  });

  // ───────────────────────────────
  // ACTIVE CATEGORY SORTING BY DATE
  // ───────────────────────────────
  test('Active dashboard - Created Date sorting', async ({ page }) => {
    await page.waitForSelector('.kv-grid-table', { state: 'visible' });
    await takeScreenshot1(page, 'active-date-sort-default.png');

    const defaultDates = await getDateValues(page);
    const isDescending = await isDateSortedDescending(defaultDates);
    expect(isDescending).toBeTruthy();

    const createdHeader = 'th[data-col-seq="2"] a.kv-sort-link, a[data-sort="created_at"]';
    await page.waitForSelector(createdHeader, { state: 'visible' });
    await page.click(createdHeader);
    await waitForSortUpdate1(page);

    const ascendingDates = await getDateValues(page);
    expect(isDateSortedAscending(ascendingDates)).toBeTruthy();

    console.log('✅ Active created date sorting verified.');
  });

  // ───────────────────────────────
  // INACTIVE CATEGORY SORTING BY NAME
  // ───────────────────────────────
  test('Inactive dashboard - Category Name sorting', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    console.log('Navigating to the inactive categories page...');
    await page.waitForSelector('.kv-grid-table', { state: 'visible' });

    await takeScreenshot(page, 'inactive-before-sorting.png');

    const sortLinkSelector = 'th[data-col-seq="1"] a.kv-sort-link, a[data-sort="cat_name"]';
    await page.waitForSelector(sortLinkSelector, { state: 'visible' });
    await page.click(sortLinkSelector);
    await waitForSortUpdate(page);

    const firstClickCategories = await getColumnValues(page, 'cat_name');
    console.log('Inactive categories after first click:', firstClickCategories);

    const isAZ = verifySorting(firstClickCategories);
    const isZA = verifyReverseSorting(firstClickCategories);

    if (isAZ) {
      console.log('✅ First click sorted A-Z, verifying Z-A...');
      await page.click(sortLinkSelector);
      await waitForSortUpdate(page);
      const secondClickCategories = await getColumnValues(page, 'cat_name');
      expect(verifyReverseSorting(secondClickCategories)).toBeTruthy();
    } else if (isZA) {
      console.log('✅ First click sorted Z-A, verifying A-Z...');
      await page.click(sortLinkSelector);
      await waitForSortUpdate(page);
      const secondClickCategories = await getColumnValues(page, 'cat_name');
      expect(verifySorting(secondClickCategories)).toBeTruthy();
    } else {
      console.log('❌ Unknown sort pattern detected.');
      await takeScreenshot(page, 'inactive-sorting-failed.png');
      const natural = isNaturallySorted(firstClickCategories);
      expect(natural).toBeTruthy();
    }

    console.log('✅ Inactive category sorting test completed.');
  });

  // ───────────────────────────────
  // INACTIVE CATEGORY SORTING BY DATE
  // ───────────────────────────────
  test('Inactive dashboard - Created Date sorting', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible' });

    await takeScreenshot1(page, 'inactive-date-sort-default.png');

    const defaultDates = await getDateValues(page);
    const isDescending = await isDateSortedDescending(defaultDates);
    expect(isDescending).toBeTruthy();

    const createdHeader = 'th[data-col-seq="2"] a.kv-sort-link, a[data-sort="created_at"]';
    await page.waitForSelector(createdHeader, { state: 'visible' });
    await page.click(createdHeader);
    await waitForSortUpdate1(page);

    const ascendingDates = await getDateValues(page);
    expect(isDateSortedAscending(ascendingDates)).toBeTruthy();

    console.log('✅ Inactive created date sorting verified.');
  });
});
