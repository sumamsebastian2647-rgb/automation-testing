// tests/submit_induction.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LogoutPage } = require('../pages/LogoutPage');
const { SubmitTask } = require('../pages/submittask.js');   


const config = require('../config');

test('Submit_induction_by_Student', async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const logout = new LogoutPage(page);
  const submittask = new SubmitTask(page);   

  // Login
  await loginPage.goto();
  await loginPage.login(config.credentials.student_username, config.credentials.student_password);

  // Navigate to Course Induction page and create a course
  await submittask.goto_induction();
  await submittask.goto_task();
  await submittask.fillTaskForm();
  await submittask.submitTask();
  await logout.logoutstudent();
 


  
});
