const { test } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const { ButtonAvailablePage } = require('./Pages/ButtonAvailablePage');
const config = require('../config');

test.describe('Trainer Management Button Tests', () => {
  test.setTimeout(60000);
  let trainerPage;
  test.beforeEach(async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    // Navigate to Trainer Management
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.openTrainerManagement();
    trainerPage = new ButtonAvailablePage(page);
  });
  test('Verify Create Trainer button is visible', async () => {
    await trainerPage.verifyCreateTrainerButton();
  });
  test('Verify Show Active Trainers button is visible', async () => {
    await trainerPage.verifyShowactiveButton();
  });
  test('Verify Show active Trainers button click functionality', async () => {
    await trainerPage.clickShowActive();
  });
  test('Verify navigation to Create Trainer page', async () => {
    await trainerPage.clickCreateTrainer();
  });
  test('Verify Create Trainer button hidden when trainer limit is reached', async () => {
  await trainerPage.verifyCreateButtonHiddenIfLimit(config.Trainer_data.trainerlicence);
});

});  
