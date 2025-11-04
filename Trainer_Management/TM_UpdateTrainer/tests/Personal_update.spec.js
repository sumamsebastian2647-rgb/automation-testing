// Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const config = require('../config');

test.describe.serial('Trainer Management - Update Trainer Flow-personal details', () => {
  test.use({ timeout: 6000000 });
  let dashboardPage;
  let page;
  // ✅ Login once and navigate to Work Experience before all tests
  test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(config.credentials.username, config.credentials.password);
        dashboardPage = new DashboardPage(page);
        await dashboardPage.openTrainerManagement();
        await dashboardPage.openUpdateTrainer();
  });
  // ✅ Close after all tests
  test.afterAll(async () => {
     await page.close();
  });
    test('Update Trainer Personal Details', async () => {
        const data = config.trainerUpdate;
        await dashboardPage.fillBasicDetails(data);
        await dashboardPage.fillAddress(data);
        await dashboardPage.selectCourseAndUploadPhoto(data.profilePhoto);
        await dashboardPage.saveTrainer();
    });
});
