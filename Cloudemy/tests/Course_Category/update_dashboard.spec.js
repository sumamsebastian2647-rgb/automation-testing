// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { Pagecoursecategory } = require('../../pages/Pagecoursecategory');
const path = require('path');
const config = require('../../config/config');

test.describe('Course Management -Course Category  Active & Inactive  Dashboard update function', () => {
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


  // ───────────────────────────────
  // UPDATE ACTIONS
  // ───────────────────────────────
  test('Course Category - Dashboard Action (Update - Tooltip) @category @regression', async () => {
    await dashboardPage1.verifyUpdateTooltip();
  });
 test('Course Category - Dashboard Action (Update - Navigation) @category @regression', async ({ page }) => {
        await dashboardPage1.clickUpdateIcon();
        await expect(page).toHaveURL(/course-categories\/update/, { timeout: 10000 });
        console.log('🔍 Verifying page header for Update Course Category...');
        await expect(dashboardPage1.pageHeader).toBeVisible({ timeout: 10000 });
        await expect(dashboardPage1.pageHeader).toContainText('UPDATE COURSE CATEGORY:', { timeout: 10000 });
        console.log('✅ Confirmed header: Update Course Category page is loaded.');
    });
   test('Course Category - Dashboard Action (Update - Function) @category @regression', async ({ page }) => {
            // --- Step 1: Generate unique updated name ---
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const updatedName = `${config.courseCategory.baseName}_updated_${timestamp}`;
        console.log('Updating category to:', updatedName);
        await dashboardPage1.clickUpdateIcon();
        // --- Step 3: Update existing category ---
        await dashboardPage1.updateCourseCategory(updatedName);
        await dashboardPage1.searchCourseCategory(updatedName);
        console.log('✅ Course category updated successfully!'); 
    });
   
  test('Course Category - Inactive Dashboard Action (Update - Tooltip) @category @regression', async () => {
    await dashboardPage1.clickShowInactiveCategories();
    await dashboardPage1.verifyUpdateTooltip();
  });
  test('Course Category - Inactive Dashboard Action (Update - Navigation) @category @regression', async ({ page }) => {
        await dashboardPage1.clickShowInactiveCategories();
        await dashboardPage1.clickUpdateIcon();
        await expect(page).toHaveURL(/course-categories\/update/, { timeout: 10000 });
        console.log('🔍 Verifying page header for Update Course Category...');
        await expect(dashboardPage1.pageHeader).toBeVisible({ timeout: 10000 });
        await expect(dashboardPage1.pageHeader).toContainText('UPDATE COURSE CATEGORY:', { timeout: 10000 });
        console.log('✅ Confirmed header: Update Course Category page is loaded.');
      });
   test('Course Category - Inactive Dashboard Action (Update - Function) @category @regression', async ({ page }) => {
        await dashboardPage1.clickShowInactiveCategories();
            // --- Step 1: Generate unique updated name ---
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const updatedName = `${config.courseCategory.baseName}_updated_${timestamp}`;
        console.log('Updating category to:', updatedName);
        await dashboardPage1.clickUpdateIcon();
        // --- Step 3: Update existing category ---
        await dashboardPage1.updateCourseCategory(updatedName);
        await dashboardPage1.searchCourseCategory(updatedName);
        console.log('✅ Course category updated successfully!');
            
    });
 
});
