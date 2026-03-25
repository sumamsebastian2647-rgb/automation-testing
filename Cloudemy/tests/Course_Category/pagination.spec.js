// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { Pagecoursecategory } = require('../../pages/Pagecoursecategory');
const path = require('path');
const config = require('../../config/config');

 require('../../pages/date_sort');

test.describe('Course Management -Category  Both Dashboard pagination @regression @category', () => {
  let dashboardPage;
  let dashboardPage1;

  // --- Login before each test ---
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    dashboardPage1 = new Pagecoursecategory(page);
    await dashboardPage1.navigateToCourseCategory();
 
  });
  test('Active-Pagination ', async () => {
     await dashboardPage1.verifySimplePagination();
  });
   test('Inactive -Pagination ', async () => {
    await dashboardPage1.clickShowInactiveCategories();
    await dashboardPage1.verifySimplePagination();
  });
  
});
