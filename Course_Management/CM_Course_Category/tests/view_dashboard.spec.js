// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Course Management -Course Category Active & Inactive Dashboard-view,search ', () => {
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
  // SEARCH ACTIONS
  // ───────────────────────────────

   test('Course Category active Dashboard search', async () => {
            await dashboardPage.searchCourseCategory(config.courseCategory.duplicate);
            console.log('Verified active dashboard search successfully');
          });
    test('Course Category inactive Dashboard search', async () => {
          await dashboardPage.clickShowInactiveCategories();
            await dashboardPage.searchCourseCategory(config.courseCategory.inactive);
            console.log('Verified active dashboard search successfully');
          });       
  // ───────────────────────────────
  // VIEW ACTIONS
  // ───────────────────────────────
  test('Course Category - Dashboard Action (View - Navigation)',  async ({ page }) => {
    await dashboardPage.viewNavigation();
  });

  test('Course Category - Dashboard Action (View - Tooltip)', async ({ page }) => {
    await dashboardPage.verifyViewTooltip();
  });

  test('Course Category - Dashboard Action (View - Page Verification)', async ({ page }) => {
    
    const { name, date } = await dashboardPage.getFirstRowDetails();
    await dashboardPage.openFirstCategoryView();
    await dashboardPage.verifyBreadcrumb(name);
    await dashboardPage.verifyCategoryDetails({ name, date });
    await dashboardPage.verifyButtons();
    await dashboardPage.clickBackAndVerify();
    await dashboardPage.openFirstCategoryView();
    console.log('🎯 Course Category View Page verification completed successfully');
  });
//--------------------------------------------------------
//inactve dashboard
//----------------------------------------------------------
test('Course Category - inactive Dashboard Action (View - Navigation)',  async ({ page }) => {
     await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.viewNavigation();
  });

  test('Course Category -inactive  Dashboard Action (View - Tooltip)', async ({ page }) => {
     await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.verifyViewTooltip();
  });

  test('Course Category -  inactive Dashboard Action (View - Page Verification)', async ({ page }) => {
     await dashboardPage.clickShowInactiveCategories();
    const { name, date } = await dashboardPage.getFirstRowDetails();
    await dashboardPage.openFirstCategoryView();
    await dashboardPage.verifyBreadcrumb(name);
    await dashboardPage.verifyCategoryDetails({ name, date });
    await dashboardPage.verifyButtons();
    await dashboardPage.clickBackAndVerify();
    await dashboardPage.openFirstCategoryView();
    await dashboardPage.clickUpdateAndVerify();
    console.log('🎯 Course Category View Page verification completed successfully');
  });
  
});
