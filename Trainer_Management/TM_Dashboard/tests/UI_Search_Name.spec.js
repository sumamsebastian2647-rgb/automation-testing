 const {expect,test}=require('@playwright/test');
 const {LoginPage}=require('./Pages/LoginPage');
 const {LogoutPage} = require('./Pages/LogoutPage');
 const {DashboardPage}=require('./Pages/DashboardPage');
 const config = require('../config');

test.describe('Trainer Management Search Tests', () => {
test.use({ timeout: 60000 }); 
  let trainerPage;
  const trainerData = config.Trainer_data;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    trainerPage = new DashboardPage(page);
    await trainerPage.openTrainerManagement();
    await trainerPage.searchTrainer('');
  });

  test('Search valid trainer by first name', async () => {
    await trainerPage.searchTrainer(trainerData.firstnameis);
    await trainerPage.verifyFirstRowContains(trainerData.Fullnameis);
  });
  test('Search valid trainer with name variation (case-insensitive)', async () => {
    // Using lowercase or mixed case intentionally
    await trainerPage.searchTrainer(trainerData.Fullnameis.toLowerCase());
    await trainerPage.verifyFirstRowContains(trainerData.Fullnameis);
  });
  test('Search invalid trainer name should show no results', async () => {
    await trainerPage.searchTrainer(trainerData.invalidnameis);
    await trainerPage.verifyNoResults();
  });
/*  test('Search valid trainer by username', async () => {
  await trainerPage.searchByUsername(trainerData.usernameis);
  await trainerPage.verifyFirstRowContains(trainerData.Fullnameis);
 });

test('Search invalid trainer by username', async () => {
  await trainerPage.searchByUsername(trainerData.invalidnameis);
  await trainerPage.verifyNoResults();
});*/
});