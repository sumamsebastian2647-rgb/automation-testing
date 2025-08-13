// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('../config');
const { writeData } = require('./utils/dataManager');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { CreateAdminPage } = require('./pages/CreateAdminPage');

// Ordered roles to be created one after another
const orderedRoles = [
  'Course Admin',
  'Student Manager',
  'Sales Manager',
  'RTO Manager',
];

test.describe('Create Admins in Specific Order', () => {
  for (const role of orderedRoles) {
    test(`Create admin for role: ${role}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const logoutPage = new LogoutPage(page);
      const createAdminPage = new CreateAdminPage(page);
      // Login
      await loginPage.goto();
      await loginPage.login(config.credentials.username, config.credentials.password);
      await page.waitForLoadState('networkidle');
      // Navigate to Create Admin
      await createAdminPage.navigateToCreateAdmin();
      // Generate unique user credentials
      const { firstName, lastName, username, email } = config.generateUserCredentials(role);
      // Fill form
      await createAdminPage.fillAdminForm({
        username,
        email,
        password: config.defaultPassword,
        firstName,
        lastName,
        phoneNumber: config.personalInfo.phoneNumber,
        address: config.addressInfo.address,
        jobRole: role,
        city: config.addressInfo.city,
      });
      // Submit
      await createAdminPage.saveAdmin();
      await createAdminPage.VerifyAdmin({firstName,});
      // Store created data
      writeData(role, {
        firstName,
        lastName,
        username,
        email,
        jobRole: role,
        phone: config.personalInfo.phoneNumber,
        city: config.addressInfo.city,
      });

      // Logout
      //await logoutPage.logout();
    });
  }
});
