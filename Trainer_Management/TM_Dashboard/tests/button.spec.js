const { test } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const { ButtonAvailablePage } = require('./Pages/ButtonAvailablePage');
const config = require('../config');

test.describe('Trainer Management Button Tests', () => {
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

  test('Verify Show Inactive Trainers button is visible', async () => {
    await trainerPage.verifyShowInactiveButton();
  });

  test('Verify Show Inactive Trainers button click functionality', async () => {
    await trainerPage.clickShowInactive();
  });

  test('Verify navigation to Create Trainer page', async () => {
    await trainerPage.clickCreateTrainer();
  });
  test('Verify Create Trainer button hidden when trainer limit is reached', async () => {
  await trainerPage.verifyCreateButtonHiddenIfLimit(config.Trainer_data.trainerlicence);
});

});
