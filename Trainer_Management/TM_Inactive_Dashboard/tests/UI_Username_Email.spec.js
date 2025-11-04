 const {expect,test}=require('@playwright/test');
 const {LoginPage}=require('./Pages/LoginPage');
 const {LogoutPage} = require('./Pages/LogoutPage');
 const {DashboardPage}=require('./Pages/DashboardPage');
 const config = require('../config');

test.describe('Trainer Management Search Tests', () => {
test.setTimeout(60000);
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

  // ------------------ Username Tests ------------------
 test('Search valid trainer by username', async ({ page }) => {
  await trainerPage.searchByUsername(trainerData.usernameis);
  await page.waitForTimeout(2000); // ✅ now defined
  await trainerPage.verifyFirstRowContains1(3, trainerData.usernameis);
});


  test('Search invalid trainer by username', async () => {
    await trainerPage.searchByUsername(trainerData.invalidnameis);
    await trainerPage.verifyNoResults();
  });

  // ------------------ Email Tests ------------------
  test('Search valid trainer by email', async () => {
    await trainerPage.searchByEmail(trainerData.emailis);
    await trainerPage.verifyFirstRowContains1(4, trainerData.emailis); // column 4 = email
  });

  test('Search invalid trainer by email', async () => {
    await trainerPage.searchByEmail('invalidemail@test.com');
    await trainerPage.verifyNoResults();
  });

  // ------------------ Mobile Tests ------------------
  test('Search valid trainer by mobile', async () => {
    await trainerPage.searchByMobile(trainerData.phoneis);
    await trainerPage.verifyFirstRowContains1(5, trainerData.phoneis); // column 5 = mobile
  });

  test('Search invalid trainer by mobile', async () => {
    await trainerPage.searchByMobile(trainerData.invalidphone);
    await trainerPage.verifyNoResults();
  }); 

});