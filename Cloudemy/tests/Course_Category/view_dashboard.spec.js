// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { Pagecoursecategory } = require('../../pages/Pagecoursecategory');
const path = require('path');
const config = require('../../config/config');

test.describe.serial('Course Management -Course Category Active & Inactive Dashboard-view,search ', () => {
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
   //Active dashboard search
   test('Course Category active Dashboard search @category @regression', async () => {
            await dashboardPage1.searchCourseCategory(config.courseCategory.duplicate);
            console.log('Verified active dashboard search successfully');
          });
    //Inactive dashboard search
    test('Course Category inactive Dashboard search @category @regression', async () => {
          await dashboardPage1.clickShowInactiveCategories();
            await dashboardPage1.searchCourseCategory(config.courseCategory.inactive);
            console.log('Verified inactive dashboard search successfully');
          });       
  // ───────────────────────────────
  // VIEW ACTIONS
  // ───────────────────────────────
  test('Course Category - Dashboard Action (View - Navigation) @category @regression',  async ({ page }) => {
    await dashboardPage1.viewNavigation();
  });

  test('Course Category - Dashboard Action (View - Tooltip) @category @regression', async ({ page }) => {
    await dashboardPage1.verifyViewTooltip();
  });

  test('Course Category - Dashboard Action (View - Page Verification)  @category @regression', async ({ page }) => {
    const { name, date } = await dashboardPage1.getFirstRowDetails();
    await dashboardPage1.openFirstCategoryView();
    await dashboardPage1.verifyBreadcrumb(name);
    await dashboardPage1.verifyCategoryDetails({ name, date });
    await dashboardPage1.verifyButtons();
    await dashboardPage1.clickBackAndVerify();
    await dashboardPage1.openFirstCategoryView();
    console.log('🎯 Course Category View Page verification completed successfully');
  });
//--------------------------------------------------------
//inactve dashboard
//----------------------------------------------------------
test('Course Category - inactive Dashboard Action (View - Navigation) @category @regression',  async ({ page }) => {
     await dashboardPage1.clickShowInactiveCategories();
    await dashboardPage1.viewNavigation();
  });

  test('Course Category -inactive  Dashboard Action (View - Tooltip) @category @regression', async ({ page }) => {
     await dashboardPage1.clickShowInactiveCategories();
    await dashboardPage1.verifyViewTooltip();
  });

  test('Course Category -  inactive Dashboard Action (View - Page Verification) @category @regression', async ({ page }) => {
     await dashboardPage1.clickShowInactiveCategories();
    const { name, date } = await dashboardPage1.getFirstRowDetails();
    await dashboardPage1.openFirstCategoryView();
    await dashboardPage1.verifyBreadcrumb(name);
    await dashboardPage1.verifyCategoryDetails({ name, date });
    await dashboardPage1.verifyButtons();
    await dashboardPage1.clickBackAndVerify();
    await dashboardPage1.openFirstCategoryView();
    console.log('🎯 Course Category View Page verification completed successfully');
  });
  
});
