// tests/add_task.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LinkCourse } = require('../pages/linkcourse');   // ✅ import PascalCase
const { LogoutPage } = require('../pages/LogoutPage');
const config = require('../config');

test('link course', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const linkcourse = new LinkCourse(page);   // ✅ instance uses camelCase
  const logoff=new LogoutPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);

  // Navigate to Course Inductio0n page and create a course
  await linkcourse.goto_induction();
  await linkcourse.link_induction();
  await linkcourse.link();
  await logoff.logout();


  
});
