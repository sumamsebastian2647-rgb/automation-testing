// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Course Management -Course List pagination', () => {
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
  test('Avtive-Pagination ', async () => {
     await dashboardPage.verifySimplePagination();
  });
  /* test('Inactive -Pagination', async () => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.verifySimplePagination();
  });*/
  
});
