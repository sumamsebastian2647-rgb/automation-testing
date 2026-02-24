const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Edit Course - Smoke', () => {
  async function openEditCourseForm(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    await dashboardPage.navigateToCourseCategory();
    await dashboardPage.openFirstCourseForEditFromList();

    return { dashboardPage };
  }

  test('@smoke edit first course successfully with basic update flow', async ({ page }) => {
    const { dashboardPage } = await openEditCourseForm(page);

    const originalCode = await page.locator('#course-c_code').inputValue();
    const originalName = await page.locator('#course-c_name').inputValue();

    const updatedCode = config.createCourseData.getUniqueCourseCode();
    const updatedName = `${config.createCourseData.getUniqueCourseName()} EDIT`;

    await dashboardPage.fillCreateCourseCode(updatedCode);
    await dashboardPage.fillCreateCourseName(updatedName);
    await dashboardPage.fillAvetmissCourseDetails(updatedCode, updatedName);

    await dashboardPage.saveUpdatedCourseAndVerifySuccessToast();

    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(page.locator('#course-c_code')).toHaveValue(updatedCode);
    await expect(page.locator('#course-c_name')).toHaveValue(updatedName);
    await expect(page.locator('#course-avetmiss_course_code')).toHaveValue(updatedCode);
    await expect(page.locator('#course-avetmiss_course_name')).toHaveValue(updatedName);

    console.log(`Original Course Code: ${originalCode}`);
    console.log(`Original Course Name: ${originalName}`);
    console.log(`Updated Course Code: ${updatedCode}`);
    console.log(`Updated Course Name: ${updatedName}`);
  });
});
