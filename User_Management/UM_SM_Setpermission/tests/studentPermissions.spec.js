// @ts-check
const { test } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { StudentManagementPage } = require('./pages/StudentManagementPage');
const config = require('../config');

test('Student permission', async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const logoutPage = new LogoutPage(page);
  const studentManagementPage = new StudentManagementPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await studentManagementPage.openUserManagement();
    await studentManagementPage.searchByFirstName(config.testSM.testuser);

  // Step 4: Verify first row has Jane Angel | Student Manager
  await studentManagementPage.verifyFirstRow(config.testSM.testuser, 'Student Manager');

 await studentManagementPage.setPermissionsFunction();
  await page.waitForTimeout(2000); 
  await studentManagementPage.setPermissionsCoure();
  await page.waitForTimeout(2000); 
  await studentManagementPage.loginAsStudent(config.testSM.testuser);
   await page.waitForTimeout(3000); 
  await studentManagementPage.verifyStudentReports();
  // Navigate to Active Students and open profile
  await studentManagementPage.searchActiveStudents('sample');

  // Sign out
    //await logoutPage.logoutSm();
});
