const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Clone Course - Regression', () => {
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

  test('@regression remove copy from cloned code and name should prevent duplicate save', async ({ page }) => {
    const { dashboardPage } = await openCloneCourseForm(page);

    const clonedCode = await page.locator('#course-c_code').inputValue();
    const clonedName = await page.locator('#course-c_name').inputValue();

    await expect(page.locator('#course-c_code')).toHaveValue(/copy/i);
    await expect(page.locator('#course-c_name')).toHaveValue(/copy/i);

    const codeWithoutCopy = clonedCode.replace(/([_\-\s]*copy)$/i, '').trim();
    const nameWithoutCopy = clonedName.replace(/([_\-\s]*copy)$/i, '').trim();
    const currentEditUrl = page.url();

    await dashboardPage.fillCreateCourseCode(codeWithoutCopy);
    await dashboardPage.fillCreateCourseName(nameWithoutCopy);
    await dashboardPage.fillAvetmissCourseDetails(codeWithoutCopy.slice(0, 10), nameWithoutCopy);
    await dashboardPage.clickSaveCourse();

    // Save should be blocked because code+name becomes duplicate of original course
    await expect(page).toHaveURL(currentEditUrl);
    await expect(
      page
        .locator('li, .help-block.help-block-error')
        .filter({ hasText: 'Course with the same code and name exists. Please use a different name.' })
        .first()
    ).toBeVisible();

    // Ensure duplicate values are still in form (not saved to a new record)
    await expect(page.locator('#course-c_code')).toHaveValue(codeWithoutCopy);
    await expect(page.locator('#course-c_name')).toHaveValue(nameWithoutCopy);
  });

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
