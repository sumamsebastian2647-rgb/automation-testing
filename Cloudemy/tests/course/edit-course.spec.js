const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('@course Edit Course Module', () => {

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

  // =========================
  // 🔥 SMOKE TEST
  // =========================
  test('@smoke edit first course successfully with basic update flow', async ({ page }) => {

    const { dashboardPage } = await openEditCourseForm(page);

    const originalCode = await page.locator('#course-c_code').inputValue();
    const originalName = await page.locator('#course-c_name').inputValue();

    const updatedCode = config.createCourseData.getUniqueCourseCode();
    const updatedName = `${config.createCourseData.getUniqueCourseName()} EDIT`;

    await dashboardPage.fillCreateCourseCode(updatedCode);
    await dashboardPage.fillCreateCourseName(updatedName);
    await dashboardPage.fillAvetmissCourseDetails(updatedCode, updatedName);
    const selectedCoreCompetencies =
        await dashboardPage.selectCoreCompetenciesOneToThree();

    const selectedElectiveCompetencies =
        await dashboardPage.selectElectiveCompetenciesFourToSix();
 console.log(`Selected Core Competencies: ${selectedCoreCompetencies.join(' | ')}`);
      console.log(`Selected Elective Competencies: ${selectedElectiveCompetencies.join(' | ')}`);

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


  // =========================
  // 🔁 REGRESSION TESTS
  // =========================

  test('@regression cannot update course without name', async ({ page }) => {

    const { dashboardPage } = await openEditCourseForm(page);
    const existingCode = await page.locator('#course-c_code').inputValue();

    await dashboardPage.fillCreateCourseCode(existingCode);
    await dashboardPage.fillCreateCourseName('');
    await dashboardPage.fillAvetmissCourseDetails(existingCode, '');
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(
      page.locator('.field-course-c_name .help-block.help-block-error')
    ).toHaveText('Name cannot be blank.');
  });


  test('@regression cannot update course without code', async ({ page }) => {

    const { dashboardPage } = await openEditCourseForm(page);
    const existingName = await page.locator('#course-c_name').inputValue();

    await dashboardPage.fillCreateCourseCode('');
    await dashboardPage.fillCreateCourseName(existingName);
    await dashboardPage.fillAvetmissCourseDetails('', existingName);
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(
      page.locator('.field-course-c_code .help-block.help-block-error')
    ).toHaveText('Code cannot be blank.');
  });


  test('@regression cannot update course with spaces in code', async ({ page }) => {

    const { dashboardPage } = await openEditCourseForm(page);
    const existingName = await page.locator('#course-c_name').inputValue();
    const invalidCode = 'AUTO 123';

    await dashboardPage.fillCreateCourseCode(invalidCode);
    await dashboardPage.fillCreateCourseName(existingName);
    await dashboardPage.fillAvetmissCourseDetails('CR12345678', existingName);
    await dashboardPage.clickSaveCourse();

    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(
      page.locator('.field-course-c_code .help-block.help-block-error')
    ).toHaveText(
      'Code can only contain letters, numbers, hyphens (-) and underscores (_). Spaces and special characters are not allowed.'
    );
  });


  test('@regression verify max length constraints on edit course fields', async ({ page }) => {

    await openEditCourseForm(page);

    const courseCode = page.locator('#course-c_code');
    const courseName = page.locator('#course-c_name');
    const avetmissCode = page.locator('#course-avetmiss_course_code');
    const avetmissName = page.locator('#course-avetmiss_course_name');

    await expect(courseCode).toHaveAttribute('maxlength', '150');
    await expect(courseName).toHaveAttribute('maxlength', '200');
    await expect(avetmissCode).toHaveAttribute('maxlength', '10');
    await expect(avetmissName).toHaveAttribute('maxlength', '100');

    await courseCode.fill('A'.repeat(200));
    await courseName.fill('B'.repeat(250));
    await avetmissCode.fill('C'.repeat(30));
    await avetmissName.fill('D'.repeat(150));

    const codeVal = await courseCode.inputValue();
    const nameVal = await courseName.inputValue();
    const avetCodeVal = await avetmissCode.inputValue();
    const avetNameVal = await avetmissName.inputValue();

    expect(codeVal.length).toBeLessThanOrEqual(150);
    expect(nameVal.length).toBeLessThanOrEqual(200);
    expect(avetCodeVal.length).toBeLessThanOrEqual(10);
    expect(avetNameVal.length).toBeLessThanOrEqual(100);
  });

});