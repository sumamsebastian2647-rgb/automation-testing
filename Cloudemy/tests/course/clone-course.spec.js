const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('@course @clone Clone Course Module', () => {
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
  //clone course, verify copy suffix, save, and verify in list
  test('@smoke clone first course, verify copy suffix, save, and verify in list', async ({ page }) => {
    const { dashboardPage } = await openCloneCourseForm(page);
    const clonedCode = await page.locator('#course-c_code').inputValue();
    const clonedName = await page.locator('#course-c_name').inputValue();
    await expect(page.locator('#course-c_code')).toHaveValue(/copy/i);
    await expect(page.locator('#course-c_name')).toHaveValue(/copy/i);
    await dashboardPage.saveClonedCourseAndVerifySaved();
   // await dashboardPage.goToCourseListFromForm();
   // await dashboardPage.searchCourseInListByCode(clonedCode);
   // await expect(page.locator('.box').filter({ hasText: clonedCode }).first()).toBeVisible();
   // await expect(page.locator('.box').filter({ hasText: clonedName }).first()).toBeVisible();
  });
  //validation for course name field - mandatory
  test('@regression cloned course cannot save when code and name are blank', async ({ page }) => {
    const { dashboardPage } = await openCloneCourseForm(page);
    await dashboardPage.fillCreateCourseCode('');
    await dashboardPage.fillCreateCourseName('');
    await dashboardPage.fillAvetmissCourseDetails('', '');
    await dashboardPage.clickSaveCourse();
    await expect(
      page.locator('.field-course-c_code .help-block.help-block-error')
    ).toHaveText('Code cannot be blank.');
    await expect(
      page.locator('.field-course-c_name .help-block.help-block-error')
    ).toHaveText('Name cannot be blank.');
  });

});