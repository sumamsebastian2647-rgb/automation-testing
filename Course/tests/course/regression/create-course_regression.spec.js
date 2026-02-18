const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Create Course - Regression', () => {
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

  test('@regression create course and find it using search function', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);

    await dashboardPage.selectFirstCourseCategory();

    // Search on training.gov.au with "water" and select first result
    await dashboardPage.searchTrainingGovCourseAndSelectFirst('water');
    await expect(page.locator('#courselist')).not.toHaveValue('');

    // Capture auto-filled values for list search verification
    const autoCourseCode = await page.locator('#course-c_code').inputValue();
    const autoCourseName = await page.locator('#course-c_name').inputValue();

    await dashboardPage.saveCourseAndVerifySuccessToast();
    await dashboardPage.goToCourseListFromForm();
    await dashboardPage.searchCourseInListByCode(autoCourseCode);

    await expect(page.locator('.box').filter({ hasText: autoCourseCode }).first()).toBeVisible();
    await expect(page.locator('.box').filter({ hasText: autoCourseName }).first()).toBeVisible();
  });

  test('@regression create course with all major fields populated', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const { duration, price, defaultTrainerName, cimage, imagePath } = config.createCourseData;
    const imageFullPath = path.resolve(cimage || imagePath);
    const uniqueCourseCode = config.createCourseData.getUniqueCourseCode();
    const uniqueCourseName = `${config.createCourseData.getUniqueCourseName()} REG`;

    await dashboardPage.selectFirstCourseCategory();
   
    // Override with unique values (AVETMISS code/name same as course code/name)
    await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
    await dashboardPage.fillCreateCourseName(uniqueCourseName);
    await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);

    // After course name, select Type (Accredited Course)
    await dashboardPage.selectCreateCourseType('3');
    await expect(page.locator('#course-c_type')).toHaveValue('3');

    await dashboardPage.fillCreateCourseDuration(duration);
    await dashboardPage.fillCreateCoursePrice(price);
    await dashboardPage.selectCreateCourseDefaultTrainer(defaultTrainerName);
    await dashboardPage.uploadCreateCourseImage(imageFullPath);

    await expect(page.locator('#course-c_duration')).toHaveValue(duration);
    await expect(page.locator('#course-c_price')).toHaveValue(price);
    await expect(page.locator('#course-c_default_trainer option:checked')).toContainText(defaultTrainerName);
    const uploadedImageValue = await page.locator('#course-upload_file').inputValue();
    expect(uploadedImageValue.toLowerCase()).toContain(path.basename(imageFullPath).toLowerCase());
   

    await dashboardPage.selectCoreCompetenciesOneToThree();
    await dashboardPage.selectElectiveCompetenciesFourToSix();
    await expect(page.locator('#compcorelist option:checked')).toHaveCount(3);
    await expect(page.locator('#compeleclist option:checked')).toHaveCount(3);

    await dashboardPage.saveCourseAndVerifySuccessToast();
    await expect(page).toHaveURL(/course\/update\?id=\d+/);
    await expect(page.locator('#course-c_code')).toHaveValue(uniqueCourseCode);
    await expect(page.locator('#course-c_name')).toHaveValue(uniqueCourseName);
    await expect(page.locator('#course-avetmiss_course_code')).toHaveValue(uniqueCourseCode);
    await expect(page.locator('#course-avetmiss_course_name')).toHaveValue(uniqueCourseName);
  });

  test('@regression verify all Create Course tooltips appear', async ({ page }) => {
    await openCreateCourseForm(page);

    const tooltipChecks = [
      {
        trigger: '.field-course-c_show_assessor_info a[data-toggle="popover"]',
        text: 'Allow students to see the assessor information on course page.',
        event: 'click',
      },
      {
        trigger: '.field-course-c_hide_nys_competency a[data-toggle="popover"]',
        text: 'Enable this setting to hide competencies that have not yet started from the student course page.',
        event: 'hover',
      },
      {
        trigger: '.field-course-c_hide_unreleased_competency a[data-toggle="popover"]',
        text: 'Enable this setting to hide unreleased competencies from the student course page.',
        event: 'hover',
      },
      {
        trigger: '.field-course-c_employer_visible a[data-toggle="popover"]',
        text: 'Enable this to allow employers to enrol their employees into this course via the Employer Portal.',
        event: 'hover',
      },
      {
        trigger: '.field-course-avetmiss_course_code a[data-toggle="popover"]',
        text: 'The Course code has to match the code in National Register (www.training.gov.au)',
        event: 'click',
      },
      {
        trigger: '.field-course-avetmiss_course_name a[data-toggle="popover"]',
        text: 'The Course name has to match the name in National Register (www.training.gov.au)',
        event: 'click',
      },
      {
        trigger: '.field-course-certificate_course_name a[data-toggle="popover"]',
        text: 'Enter the course name for certification.',
        event: 'click',
      },
      {
        trigger: 'label[for="course-vet_flag"] a[data-toggle="popover"]',
        text: 'Tick this box if the purpose of the program of study is designed for vocational training OR the training program is general and pre-vocational designed as pre-requisites for other VET Programs.',
        event: 'click',
      },
      {
        trigger: '.field-course-vet_educationid_name a[data-toggle="popover"]',
        text: 'The Australian Standard Classification of Education (ASCED) Field of Education identifier.',
        event: 'click',
      },
      {
        trigger: '.field-course-vet_anzsco_field a[data-toggle="popover"]',
        text: 'The Australian and New Zealand Standard Classification of Occupations identifier uniquely identifies',
        event: 'click',
      },
    ];

    for (const item of tooltipChecks) {
      await page.keyboard.press('Escape').catch(() => {});
      const trigger = page.locator(item.trigger).first();
      await expect(trigger).toBeVisible();

      if (item.event === 'hover') {
        await trigger.hover();
      } else {
        await trigger.click();
      }

      await expect(
        page.locator('.popover:visible').filter({ hasText: item.text }).first()
      ).toBeVisible();
      await page.keyboard.press('Escape').catch(() => {});
    }
  });

  test('@regression cannot create duplicate course with same code and name', async ({ page }) => {
    const { dashboardPage } = await openCreateCourseForm(page);
    const duplicateCode = config.createCourseData.getUniqueCourseCode();
    const duplicateName = `${config.createCourseData.getUniqueCourseName()} DUP`;
    // First create (baseline)
    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseCode(duplicateCode);
    await dashboardPage.fillCreateCourseName(duplicateName);
    await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
    await dashboardPage.saveCourseAndVerifySuccessToast();
    // Open create again and try same code + name
    await dashboardPage.goToCourseListFromForm();
    await dashboardPage.clickCreateCourse();
    await dashboardPage.selectFirstCourseCategory();
    await dashboardPage.fillCreateCourseCode(duplicateCode);
    await dashboardPage.fillCreateCourseName(duplicateName);
    await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
    await dashboardPage.clickSaveCourse();
    await expect(page).toHaveURL(/course\/create/);
    await expect(
      page.locator('li, .help-block.help-block-error').filter({ hasText: 'Course with the same code and name exists. Please use a different name.' }).first()
    ).toBeVisible();
  });

  test('@regression verify max length for course code and course name fields', async ({ page }) => {
    await openCreateCourseForm(page);
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
