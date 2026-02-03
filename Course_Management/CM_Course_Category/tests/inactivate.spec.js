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
  takeScreenshot1,  // must include "1" suffix
  waitForSortUpdate1,
  getSortLinkAttribute
} = require('./pages/date_sort');

test.describe('Course Management -Course Category Active,inactive  Dashboard', () => {
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
  // INACTIVATE ACTIONS
  // ───────────────────────────────
  test(' Dashboard Action (Inactivate - Tooltip)', async ({ page }) => {
    await dashboardPage.verifyinactivateTooltip();
  });

  test(' Dashboard Action (Inactivate)', async ({ page }) => {
     await dashboardPage.inactivateFirstCategory();
    
  });

   test(' Dashboard Action (Activate - Tooltip)', async ({ page }) => {
    await dashboardPage.verifyinactivateTooltip();
  });

  //-------------------Activate
   test('Dashboard Action (activate - Tooltip)', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage. verifyactivateTooltip();
  });
   test(' Dashboard Action (reactivate)', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.reactivateFirstCategory();
  });
  //---------------------------------------Delete
  test('Dashboard Action (Delete - Tooltip)', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage. verifyDeleteTooltip();
  });

  test('Course Category - Dashboard Action (Delete)', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.deleteFirstCourseCategory();
    
  });
});
