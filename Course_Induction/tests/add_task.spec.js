// tests/add_task.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AddTask } = require('../pages/addtask');   // ✅ match filename
const { LogoutPage } = require('../pages/LogoutPage');
const config = require('../config');

test('Create task', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const addTask = new AddTask(page);
  const logoff=new LogoutPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);

  // Navigate to Course Induction and open induction from JSON
  await addTask.gotoCourseInductionList();
  await addTask.openInductionFromJson();
  await addTask.createtask();
  await logoff.logout();

});
