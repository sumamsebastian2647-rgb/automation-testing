// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');
// Utility to generate a unique cohort name
function generateUniqueCohortName(baseName = 'AutomationCohort') {
    const timestamp = new Date().getTime(); // e.g., 1700000000000
    return `${baseName}_${timestamp}`;
}

test.describe('Course Management - Cohort ', () => {
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

   test('View', async ({ page }) => {
        await dashboardPage.searchCohortByName(config.cohortSearch.name);
        await dashboardPage.cohortselect();
    });
});
