import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CourseForumPage } from './pages/CourseForumPage';
import { LogoutPage } from './pages/LogoutPage';
import { NotificationPage } from './pages/NotificationPage';
const config = require('../config');

test('test', async ({ page }) => {
  test.setTimeout(60000); 
 const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const courseForumPage = new CourseForumPage(page);
  const logoutPage = new LogoutPage(page);
  const notificationPage = new NotificationPage(page);

   await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForTimeout(3000);
  await dashboardPage.navigateToCourseForum();
  await courseForumPage.searchCourse(config.variables.course);
  await courseForumPage.createTopic(config.variables.topicTitle, config.variables.topicDescription);
  await page.waitForTimeout(3000);
  await logoutPage.logout();
  await page.waitForTimeout(3000);
  // Student login and notification check
  await loginPage.goto();
  await loginPage.login(config.credentials.student_username, config.credentials.student_password);
  await notificationPage.checkNotifications();

 
});
