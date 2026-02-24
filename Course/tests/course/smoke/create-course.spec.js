const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Create Course - Smoke', () => {
  async function openCreateCourseForm(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    await dashboardPage.navigateToCourseCategory();
    await dashboardPage.clickCreateCourse();

    return { dashboardPage };
  }

  test('@smoke Create course successfully and verify in list', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const uniqueCourseCode = config.createCourseData.getUniqueCourseCode();
    const uniqueCourseName = config.createCourseData.getUniqueCourseName();
    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
    await dashboardPage.fillCreateCourseName(uniqueCourseName);
    await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);
    const selectedCoreCompetencies = await dashboardPage.selectCoreCompetenciesOneToThree();
    const selectedElectiveCompetencies = await dashboardPage.selectElectiveCompetenciesFourToSix();
    await expect(page.locator('#compcorelist option:checked')).toHaveCount(3);
    await expect(page.locator('#compeleclist option:checked')).toHaveCount(3);
    await expect(page).toHaveURL(/course\/create/);
    await dashboardPage.saveCourseAndVerifySuccessToast();
    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(page.locator('#course-c_code')).toHaveValue(uniqueCourseCode);
    await expect(page.locator('#course-c_name')).toHaveValue(uniqueCourseName);
    await expect(page.locator('#course-avetmiss_course_code')).toHaveValue(uniqueCourseCode);
    await expect(page.locator('#course-avetmiss_course_name')).toHaveValue(uniqueCourseName);
    await expect(page.getByText(/Well Done![\s\S]*Course has been added successfully/i)).toBeVisible();
    await dashboardPage.goToCourseListFromForm();
    await dashboardPage.searchCourseInListByCode(uniqueCourseCode);
    await expect(page.locator('.box').filter({ hasText: uniqueCourseCode }).first()).toBeVisible();
    await expect(page.locator('.box').filter({ hasText: uniqueCourseName }).first()).toBeVisible();
    console.log(`Created Course Code: ${uniqueCourseCode}`);
    console.log(`Created Course Name: ${uniqueCourseName}`);
    console.log(`Search list contains created course name: ${uniqueCourseName}`);
    console.log(`Selected Core Competencies (1,2,3): ${selectedCoreCompetencies.join(' | ')}`);
    console.log(`Selected Elective Competencies (4,5,6): ${selectedElectiveCompetencies.join(' | ')}`);
  });

  test('@smoke Cannot create course without name', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const uniqueCourseCode = config.createCourseData.getUniqueCourseCode();
    const uniqueCourseName = config.createCourseData.getUniqueCourseName();

    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
    await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/create/);
    await expect(
      page.locator('.field-course-c_name .help-block.help-block-error')
    ).toHaveText('Name cannot be blank.');
  });

  test('@smoke Cannot create course without code', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const uniqueCourseCode = config.createCourseData.getUniqueCourseCode();
    const uniqueCourseName = config.createCourseData.getUniqueCourseName();

    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseName(uniqueCourseName);
    await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/create/);
    await expect(
      page.locator('.field-course-c_code .help-block.help-block-error')
    ).toHaveText('Code cannot be blank.');
  });

  test('@smoke Cannot create course with spaces in code', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const invalidCourseCode = 'AUTO 123';
    const uniqueCourseName = config.createCourseData.getUniqueCourseName();
    const uniqueAvetmissCode = config.createCourseData.getUniqueCourseCode();

    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseCode(invalidCourseCode);
    await dashboardPage.fillCreateCourseName(uniqueCourseName);
    await dashboardPage.fillAvetmissCourseDetails(uniqueAvetmissCode, uniqueCourseName);
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/create/);
    await expect(
      page.locator('.field-course-c_code .help-block.help-block-error')
    ).toHaveText(
      'Code can only contain letters, numbers, hyphens (-) and underscores (_). Spaces and special characters are not allowed.'
    );
  });

});
