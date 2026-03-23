// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Course Management -', () => {
  let dashboardPage;

  // --- Login before each test ---
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToCourseCohort();
  });
    test('cohort management buttons  visibility', async ({ page }) => {
        

        await expect(dashboardPage.showInactiveBtn).toBeVisible();
        await expect(dashboardPage.createCohortBtn).toBeVisible();

        console.log('Both buttons are visible.');
    });
     test('Verify navigation of Show Inactive Cohorts button', async ({ page }) => {
        
        await dashboardPage.clickShowInactive();

        await expect(page).toHaveURL(/.*\/course-class\/\?showactive=0/);

        console.log('Navigation for Show Inactive Cohorts button verified.');
    });

    test('Verify navigation of Create Cohort button', async ({ page }) => {
        
        await dashboardPage.clickCreateCohort();

        await expect(page).toHaveURL(/.*\/course-class\/create/);

        console.log('Navigation for Create Cohort button verified.');
    });
});
