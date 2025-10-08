// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { UpdateAdminPage } = require('./pages/UpdateAdminPage');


test.describe('Update Admins FUnctionality', () => {
  test.setTimeout(600000);

    test('Update admin:', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const logoutPage = new LogoutPage(page);
      const updateAdminPage = new UpdateAdminPage(page);
      // Login
      await loginPage.goto();
      await loginPage.login(config.credentials.username, config.credentials.password);
      await page.waitForLoadState('networkidle');
      // Navigate to Create Admin
      await updateAdminPage.navigateToCreateAdmin();
           // Fill form
      await updateAdminPage.fillAdminForm();
      // Submit
      await updateAdminPage.saveAdmin();
      const toast = page.locator('text=Profile has been updated successfully.');
     await expect(toast).toHaveCount(1, { timeout: 5000 });
      

      // Logout
      //await logoutPage.logout();
    });
  
});
