// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { Pagecoursecategory } = require('../../pages/Pagecoursecategory');
const path = require('path');
const config = require('../../config/config');

test.describe('Course Management - Course Category Active, Inactive Dashboard', () => {
  let dashboardPage;
  let dashboardPage1;

  // --- Login before each test ---
  test.beforeEach(async ({ page }) => {
        page.setDefaultTimeout(30000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    dashboardPage = new DashboardPage(page);
    dashboardPage1 = new Pagecoursecategory(page);
    await dashboardPage1.navigateToCourseCategory();
    await page.waitForURL(/course-categories\/index/, { timeout: 15000 });
    await page.waitForSelector('table tbody', { state: 'visible', timeout: 15000 });
  });

  // ───────────────────────────────
  // INACTIVATE ACTIONS
  // ───────────────────────────────
  test('Dashboard Action (Inactivate - Tooltip) @category @regression', async ({ page }) => {
    // ✅ Headless-safe: ensure inactivate button is visible in DOM before verifying tooltip
    await page.waitForSelector('a.btn-danger[title="inactivate"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.verifyinactivateTooltip();
  });
  // ✅ Inactivate action from active dashboard
  test('Dashboard Action (Inactivate) @category @regression', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('a.btn-danger[title="inactivate"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.inactivateFirstCategory();
    await page.waitForLoadState('networkidle');
  });
  // ✅ Verify inactivate tooltip is present in active dashboard
  test('Dashboard Action (Activate - Tooltip) @category  @regression', async ({ page }) => {
    await page.waitForSelector('a.btn-danger[title="inactivate"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.verifyinactivateTooltip();
  });
  // ✅ Verify activate tooltip is present in inactive dashboard
  test('Dashboard Action (Activate - Tooltip from Inactive view) @category @regression', async ({ page }) => {
    await page.waitForSelector(
      'a.btn.btn-warning.btn-flat.pull-right.margin-right-one',
      { state: 'visible', timeout: 10000 }
    );
    await dashboardPage1.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.btn.btn-warning[title="activate"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.verifyactivateTooltip();
  });
  // ✅ Activate action from inactive dashboard
  test('Dashboard Action (Reactivate) @category @regression', async ({ page }) => {
    await page.waitForSelector(
      'a.btn.btn-warning.btn-flat.pull-right.margin-right-one',
      { state: 'visible', timeout: 10000 }
    );
    await dashboardPage1.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('a.btn.btn-warning[title="activate"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.reactivateFirstCategory();
    await page.waitForLoadState('networkidle');
  });
  //Verify delete tooltip in inactive dashboard
  test('Dashboard Action (Delete - Tooltip) @regression', async ({ page }) => {
    await page.waitForSelector(
      'a.btn.btn-warning.btn-flat.pull-right.margin-right-one',
      { state: 'visible', timeout: 10000 }
    );
    await dashboardPage1.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.btn-danger[title="Delete"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.verifyDeleteTooltip();
  });
  //Delete action from inactive dashboard
  test('Course Category - Dashboard Action (Delete) @category @regression', async ({ page }) => {
    await page.waitForSelector(
      'a.btn.btn-warning.btn-flat.pull-right.margin-right-one',
      { state: 'visible', timeout: 10000 }
    );
    await dashboardPage1.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('a.btn-danger[title="Delete"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.deleteFirstCourseCategory();
    await page.waitForLoadState('networkidle');
  });
});