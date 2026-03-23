// tests/pagination.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const { PaginationPage } = require('./pages/PaginationPage');
const config = require('../config');

test.describe('Course Management - Cohort Pagination', () => {
  let dashboardPage;
  let paginationPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);

    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToCourseCohort();

    paginationPage = new PaginationPage(page);
  });

  test('Verify pagination functionality', async ({ page }) => {
    // ---------- PAGE 1 ----------
    await expect(page).toHaveURL(/\/course-class\/index(\?page=1)?$/);
    await paginationPage.verifyPrevDisabled();
    await paginationPage.verifyActivePage(1);
    await expect(paginationPage.pageNumber(2)).toBeVisible(); // Page 2 visible

    // ---------- GO TO PAGE 2 ----------
    await paginationPage.clickPage(2);
    await paginationPage.verifyActivePage(2);
    await paginationPage.verifyPrevEnabled();
    await expect(page).toHaveURL(/page=2/);

    // ---------- CLICK NEXT ----------
    await paginationPage.verifyNextExists();
    await paginationPage.clickNext();
    await expect(page).not.toHaveURL(/page=2/);

    console.log('Pagination POM verification completed.');
  });
});
