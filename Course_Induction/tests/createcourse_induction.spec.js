const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { CourseInductionPage } = require('../pages/CourseInductionPage');
const config = require('../config');
const { LogoutPage } = require('../pages/LogoutPage');

test('Create Course Induction', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const courseInductionPage = new CourseInductionPage(page);
    const logoff=new LogoutPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);

  // Navigate to Course Induction page and create a course
  await courseInductionPage.goto_induction();
  await courseInductionPage.createCourse(config.courseInduction.name);
  await courseInductionPage.verify_induction(config.courseInduction.name);
  await logoff.logout();

  
}); 
  