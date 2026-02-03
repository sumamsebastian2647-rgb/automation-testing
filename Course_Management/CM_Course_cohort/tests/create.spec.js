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

 /* test('Create a new cohort with unique name', async ({ page }) => {
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
 });*/
 test('Create Cohort Form Validation', async ({ page }) => {
   const uniqueName1 = generateUniqueCohortName('AutomationCohort');
        // 1️⃣ Submit empty form
    await dashboardPage.clickSave();
    // Check all required field errors
    await dashboardPage.expectErrorMessage('Trainer cannot be blank.');
    await dashboardPage.expectErrorMessage('Course cannot be blank.');
    await dashboardPage.expectErrorMessage('Cohort Name Class Name cannot be blank.');
    await dashboardPage.expectErrorMessage('Class Location cannot be blank.');
    // 2️⃣ Fill Trainer only
    await dashboardPage.selectTrainer(config.trainers.defaultTrainer);
    await dashboardPage.clickSave();
    await dashboardPage.expectErrorMessage('Course cannot be blank.');
    await dashboardPage.expectErrorMessage('Cohort Name Class Name cannot be blank.');
    await dashboardPage.expectErrorMessage('Class Location cannot be blank.');
    // 3️⃣ Select Course
    await dashboardPage.selectCourse(config.courses.carbonFarming,);
    await dashboardPage.expectErrorMessage('Cohort Name Class Name cannot be blank.');
    await dashboardPage.expectErrorMessage('Class Location cannot be blank.');
    // 4️⃣ Fill Cohort Name
    await dashboardPage.fillCohort_name(uniqueName1);
    await dashboardPage.expectErrorMessage('Class Location cannot be blank.');
    // 5️⃣ Fill Cohort Location
    await dashboardPage.fillCohort_location(config.cohorts.default.location);
    await dashboardPage.clickSave();
    console.log('Form validation test completed.');
  });
});
