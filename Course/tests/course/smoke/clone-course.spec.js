const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Clone Course - Smoke', () => {
  async function openCloneCourseForm(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    await dashboardPage.navigateToCourseCategory();
    await dashboardPage.openFirstCourseForCloneFromList();

    return { dashboardPage };
  }

  test('@smoke clone first course, verify copy suffix, save, and verify in list', async ({ page }) => {
    const { dashboardPage } = await openCloneCourseForm(page);

    const clonedCode = await page.locator('#course-c_code').inputValue();
    const clonedName = await page.locator('#course-c_name').inputValue();

    await expect(page.locator('#course-c_code')).toHaveValue(/copy/i);
    await expect(page.locator('#course-c_name')).toHaveValue(/copy/i);

    await dashboardPage.saveClonedCourseAndVerifySaved();

    await dashboardPage.goToCourseListFromForm();
    await dashboardPage.searchCourseInListByCode(clonedCode);

    await expect(page.locator('.box').filter({ hasText: clonedCode }).first()).toBeVisible();
    await expect(page.locator('.box').filter({ hasText: clonedName }).first()).toBeVisible();

    console.log(`Cloned Course Code: ${clonedCode}`);
    console.log(`Cloned Course Name: ${clonedName}`);
  });
});



