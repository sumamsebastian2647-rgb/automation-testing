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
    await dashboardPage.clickCreateCohort();
  });

  test('View', async ({ page }) => {
        // Generate a unique cohort name
    const uniqueName = generateUniqueCohortName('AutomationCohort');
    // Create cohort using config values and unique name
    await dashboardPage.createCohort(
        config.trainers.defaultTrainer,
        config.courses.carbonFarming,
        {
            name: uniqueName,
            location: config.cohorts.default.location,
            startDate: config.cohorts.default.startDate,
            endDate: config.cohorts.default.endDate
        }
    );
    console.log('Cohort created with  name:', uniqueName);
    await dashboardPage.searchCohortByName(uniqueName);
    console.log('Cohort verified  with  name:', uniqueName);
 });

});
