const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('@course @create Create Course Module', () => {

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

  /* =====================================================
     🔥 SMOKE TESTS
  ===================================================== */

  test.describe('@smoke', () => {

    test('Create course successfully and verify in list', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const uniqueCourseCode =
        `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const uniqueCourseName =
        `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);

      const selectedCoreCompetencies =
        await dashboardPage.selectCoreCompetenciesOneToThree();

      const selectedElectiveCompetencies =
        await dashboardPage.selectElectiveCompetenciesFourToSix();

      await dashboardPage.saveCourseAndVerifySuccessToast();

      await dashboardPage.goToCourseListFromForm();
      await dashboardPage.searchCourseInListByCode(uniqueCourseCode);

      await expect(
        page.locator('.box').filter({ hasText: uniqueCourseCode }).first()
      ).toBeVisible();

      await expect(
        page.locator('.box').filter({ hasText: uniqueCourseName }).first()
      ).toBeVisible();

      console.log(`Created Course Code: ${uniqueCourseCode}`);
      console.log(`Created Course Name: ${uniqueCourseName}`);
      console.log(`Selected Core Competencies: ${selectedCoreCompetencies.join(' | ')}`);
      console.log(`Selected Elective Competencies: ${selectedElectiveCompetencies.join(' | ')}`);
    });


    test('Cannot create course without name', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const uniqueCourseCode =
        `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
      await dashboardPage.clickSaveCourse();

      await expect(
        page.locator('.field-course-c_name .help-block.help-block-error')
      ).toHaveText('Name cannot be blank.');
    });


    test('Cannot create course without code', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const uniqueCourseName =
        `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.clickSaveCourse();

      await expect(
        page.locator('.field-course-c_code .help-block.help-block-error')
      ).toHaveText('Code cannot be blank.');
    });


    test('Cannot create course with spaces in code', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const invalidCourseCode = 'AUTO 123';
      const uniqueCourseName =
        `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const uniqueAvetmissCode =
        `AVET-${Date.now()}`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(invalidCourseCode);
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.fillAvetmissCourseDetails(uniqueAvetmissCode, uniqueCourseName);
      await dashboardPage.clickSaveCourse();

      await expect(
        page.locator('.field-course-c_code .help-block.help-block-error')
      ).toHaveText(
        'Code can only contain letters, numbers, hyphens (-) and underscores (_). Spaces and special characters are not allowed.'
      );
    });

  });


  /* =====================================================
     🔵 REGRESSION TESTS
  ===================================================== */

  test.describe('@regression', () => {

    test('create course and find it using search function', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.searchTrainingGovCourseAndSelectFirst('water');

      await expect(page.locator('#courselist')).not.toHaveValue('');

      const autoCourseCode = await page.locator('#course-c_code').inputValue();
      const autoCourseName = await page.locator('#course-c_name').inputValue();

      await dashboardPage.saveCourseAndVerifySuccessToast();

      await dashboardPage.goToCourseListFromForm();
      await dashboardPage.searchCourseInListByCode(autoCourseCode);

      await expect(
        page.locator('.box').filter({ hasText: autoCourseCode }).first()
      ).toBeVisible();

      await expect(
        page.locator('.box').filter({ hasText: autoCourseName }).first()
      ).toBeVisible();
    });


    test('create course with all major fields populated', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const { duration, price, defaultTrainerName } =
        config.createCourseData;

      const filePath = path.join(
        process.cwd(),
        config.createCourseData.folder,
        config.createCourseData.image1
      );

      const uniqueCourseCode =
        `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const uniqueCourseName =
        `Course-${Date.now()}-${Math.floor(Math.random() * 1000)} REG`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);

      await dashboardPage.selectCreateCourseType('3');
      await dashboardPage.fillCreateCourseDuration(duration);
      await dashboardPage.fillCreateCoursePrice(price);
      await dashboardPage.selectCreateCourseDefaultTrainer(defaultTrainerName);
      await dashboardPage.uploadCreateCourseImage(filePath);

      await dashboardPage.selectCoreCompetenciesOneToThree();
      await dashboardPage.selectElectiveCompetenciesFourToSix();

      await dashboardPage.saveCourseAndVerifySuccessToast();

      await expect(page.locator('#course-c_code'))
        .toHaveValue(uniqueCourseCode);

      await expect(page.locator('#course-c_name'))
        .toHaveValue(uniqueCourseName);
    });


    test('verify all Create Course tooltips appear', async ({ page }) => {

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

        const popover = page.locator('.popover')
          .filter({ hasText: item.text });

        await expect(popover).toBeVisible({ timeout: 10000 });
      }
    });


    test('cannot create duplicate course with same code and name', async ({ page }) => {

      const { dashboardPage } = await openCreateCourseForm(page);

      const duplicateCode =
        `DUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const duplicateName =
        `Duplicate-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // ---- First Creation ----
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(duplicateCode);
      await dashboardPage.fillCreateCourseName(duplicateName);
      await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
      await dashboardPage.saveCourseAndVerifySuccessToast();

      await dashboardPage.goToCourseListFromForm();

      // ---- Second Attempt (Duplicate) ----
      await dashboardPage.clickCreateCourse();
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(duplicateCode);
      await dashboardPage.fillCreateCourseName(duplicateName);
      await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
      await dashboardPage.clickSaveCourse();

      await expect(
        page.locator('.field-course-c_name .help-block.help-block-error')
      ).toHaveText(/same code.*exists/i);
    });


    test('verify max length for course code and course name fields', async ({ page }) => {

      await openCreateCourseForm(page);

      const courseCode = page.locator('#course-c_code');
      const courseName = page.locator('#course-c_name');

      await expect(courseCode).toHaveAttribute('maxlength', '150');
      await expect(courseName).toHaveAttribute('maxlength', '200');
    });

  });

});