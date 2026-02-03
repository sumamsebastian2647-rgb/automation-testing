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

test.describe.serial('Course Management - Active & Inactive Category Creation Tests', () => {
  let dashboardPage;
  let dashboardPage1;

  // 🔹 Login fresh before each test for isolation & stability
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToCourseCategory();
  });

  // ───────────────────────────────
  // ✅ Create Course Category - Active
  // ───────────────────────────────
  test('Active dashboard - Create new Course Category', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName = `${config.courseCategory.baseName}_${timestamp}`;
    console.log('Creating active category:', categoryName);

    await dashboardPage.openCreateForm();
    await dashboardPage.createCourseCategory(categoryName);
    await dashboardPage.searchCourseCategory(categoryName);

    console.log('✅ Created new active course category successfully');
  });

  // ───────────────────────────────
  // ✅ Create Course Category - UI Validation
  // ───────────────────────────────
  test('Active dashboard - Validate empty form error UI', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName1 = `${config.courseCategory.baseName}_${timestamp}`;
    await dashboardPage.openCreateForm();
    await dashboardPage.submitEmptyForm();
    const errorSummary = page.locator('.error-summary');
    await expect(errorSummary).toBeVisible();
    await expect(
      errorSummary.locator('li', { hasText: 'Category Name cannot be blank.' })
    ).toBeVisible();
    console.log('⚠️ Validation error displayed as expected');
    // ✅ Fill in valid data after validation
    await page.fill('#coursecategories-cat_name', categoryName1);
    await page.locator('div.box-footer button.btn.btn-success.btn-flat').click();
    await dashboardPage.searchCourseCategory(categoryName1);
    console.log('✅ Verified category UI creation after validation');
  });

  // ───────────────────────────────
  // ✅ Create Course Category - Duplicate Check
  // ───────────────────────────────
  test('Active dashboard - Duplicate Course Category name check', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName2 = `${config.courseCategory.baseName}_${timestamp}`;
    await dashboardPage.openCreateForm();
    await page.fill('#coursecategories-cat_name', config.courseCategory.duplicate);
    await dashboardPage.submitEmptyForm();
    const errorToast = page.locator('.alert.alert-danger[role="alert"]');
    await expect(errorToast).toBeVisible({ timeout: 10000 });
    await expect(errorToast).toContainText('Course category already exist.');
    console.log('⚠️ Duplicate category error displayed as expected');
    // ✅ Create new unique category afterward
    await page.fill('#coursecategories-cat_name', categoryName2);
    await page.locator('div.box-footer button.btn.btn-success.btn-flat').click();
    await dashboardPage.searchCourseCategory(categoryName2);
    console.log('✅ Verified duplicate and new category creation successfully');
  });

  // ───────────────────────────────
  // ✅ Create Course Category - Inactive Dashboard
  // ───────────────────────────────
  test('Inactive dashboard - Create new Course Category', async ({ page }) => {
    await dashboardPage.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible' });
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName = `${config.courseCategory.baseName}_INACTIVE_${timestamp}`;
    console.log('Creating category in inactive dashboard:', categoryName);
    // 🟡 Even in inactive view, use the same active DashboardPage for creation
    await dashboardPage.openCreateForm();
    await dashboardPage.createCourseCategory(categoryName);
    await dashboardPage.searchCourseCategory(categoryName);
    console.log('✅ Created course category successfully from inactive dashboard view');
  });
});
