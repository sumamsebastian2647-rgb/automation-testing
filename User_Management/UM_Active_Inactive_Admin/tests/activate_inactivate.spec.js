const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { UserManagementPage } = require('./pages/UserManagementPage');

test.describe('User Activation & Inactivation', () => {
  let page;
  let loginPage;
  let logoutPage;
  let UserPage;
  const testUser = config.activate_inactivate_testuser.testuser;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    logoutPage = new LogoutPage(page);
    UserPage = new UserManagementPage(page);
    // Login before all tests
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await page.waitForLoadState('networkidle');
  });

  test('Inactivate and then Reactivate user', async () => {
    // Navigate to User Management
    await UserPage.navigate();
    // Inactivate user
    await UserPage.inactivateUser(testUser);
    await page.reload();
       // Reactivate user
    await UserPage.reactivateUser(testUser);
    });
   
  test.afterAll(async () => {
    // Logout after all tests
    await logoutPage.logout();
    await page.close();
  });
});
