// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');
test.describe('Course Management -Course Category  Active & Inactive  Dashboard update function', () => {
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
  // UPDATE ACTIONS
  // ───────────────────────────────
  test('Course Category - Dashboard Action (Update - Tooltip)', async () => {
    await dashboardPage.verifyUpdateTooltip();
  });

 
    test('Course Category - Dashboard Action (Update - Navigation)', async ({ page }) => {
      
        await dashboardPage.clickUpdateIcon();
        await expect(page).toHaveURL(/course-categories\/update/, { timeout: 10000 });
        console.log('🔍 Verifying page header for Update Course Category...');
        await expect(dashboardPage.pageHeader).toBeVisible({ timeout: 10000 });
        await expect(dashboardPage.pageHeader).toContainText('UPDATE COURSE CATEGORY:', { timeout: 10000 });
        console.log('✅ Confirmed header: Update Course Category page is loaded.');
    });
   test('Course Category - Dashboard Action (Update - Function)', async ({ page }) => {
            // --- Step 1: Generate unique updated name ---
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const updatedName = `${config.courseCategory.baseName}_updated_${timestamp}`;
        console.log('Updating category to:', updatedName);
        await dashboardPage.clickUpdateIcon();
        // --- Step 3: Update existing category ---
        await dashboardPage.updateCourseCategory(updatedName);
        await dashboardPage.searchCourseCategory(updatedName);
        console.log('✅ Course category updated successfully!');
            
    });
    //_____________________________________________________________________
   // inactive dashboard
   //________________________________________________________________________
   // ───────────────────────────────
  // UPDATE ACTIONS
  // ───────────────────────────────
  test('Course Category - Inactive Dashboard Action (Update - Tooltip)', async () => {
    await dashboardPage.clickShowInactiveCategories();
    await dashboardPage.verifyUpdateTooltip();
  });

 
    test('Course Category - Inactive Dashboard Action (Update - Navigation)', async ({ page }) => {
        await dashboardPage.clickShowInactiveCategories();
        await dashboardPage.clickUpdateIcon();
        await expect(page).toHaveURL(/course-categories\/update/, { timeout: 10000 });
        console.log('🔍 Verifying page header for Update Course Category...');
        await expect(dashboardPage.pageHeader).toBeVisible({ timeout: 10000 });
        await expect(dashboardPage.pageHeader).toContainText('UPDATE COURSE CATEGORY:', { timeout: 10000 });
        console.log('✅ Confirmed header: Update Course Category page is loaded.');
    });
   test('Course Category - Inactive Dashboard Action (Update - Function)', async ({ page }) => {
        await dashboardPage.clickShowInactiveCategories();
            // --- Step 1: Generate unique updated name ---
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const updatedName = `${config.courseCategory.baseName}_updated_${timestamp}`;
        console.log('Updating category to:', updatedName);
        await dashboardPage.clickUpdateIcon();
        // --- Step 3: Update existing category ---
        await dashboardPage.updateCourseCategory(updatedName);
        await dashboardPage.searchCourseCategory(updatedName);
        console.log('✅ Course category updated successfully!');
            
    });


 
});
