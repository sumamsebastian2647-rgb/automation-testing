const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('@course @create Create Course Module', () => {
  test.setTimeout(800000);
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

  test.describe('@smoke', () => {
    // This test covers creating a course with unique code and name, filling in AVETMISS details, selecting competencies, saving the course, and verifying it appears in the course list.
   test('Create course successfully and verify in list', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      const uniqueCourseCode = `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const uniqueCourseName = `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.fillAvetmissCourseDetails(uniqueCourseCode, uniqueCourseName);
      const selectedCoreCompetencies = await dashboardPage.selectCoreCompetenciesOneToThree();
      const selectedElectiveCompetencies = await dashboardPage.selectElectiveCompetenciesFourToSix();
      await dashboardPage.saveCourseAndVerifySuccessToast();
      await dashboardPage.goToCourseListFromForm();
      await dashboardPage.searchCourseInListByCode(uniqueCourseCode);
      await expect(page.locator('.box', { hasText: uniqueCourseCode }).first()).toBeVisible();
      await expect(page.locator('.box', { hasText: uniqueCourseName }).first()).toBeVisible();
      console.log(`Created Course Code: ${uniqueCourseCode}`);
      console.log(`Created Course Name: ${uniqueCourseName}`);
      console.log(`Core: ${selectedCoreCompetencies.join(' | ')}`);
      console.log(`Elective: ${selectedElectiveCompetencies.join(' | ')}`);
    });
  });

  test.describe.serial('@regression', () => {
    /*// This test creates a course using the auto-generated code and name from the Training.gov search, then verifies it appears in the course list. It also checks for duplicate course handling.
    test('create course and find it using search function', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.searchTrainingGovCourseAndSelectFirst('water');
      const courseDropdown = page.locator('#courselist');
      await expect(courseDropdown).toBeVisible();
      const selectedValue = await courseDropdown.inputValue();
      expect(selectedValue).not.toBe('');
      // ✅ Get AUTO-GENERATED values (IMPORTANT)
      const autoCourseCode = await page.locator('#course-c_code').inputValue();
      const autoCourseName = await page.locator('#course-c_name').inputValue();
      console.log('Auto Code:', autoCourseCode);
      console.log('Auto Name:', autoCourseName);
      // Use same values (no override)
      await dashboardPage.fillCreateCourseCode(autoCourseCode);
      await dashboardPage.fillCreateCourseName(autoCourseName);
      await dashboardPage.fillAvetmissCourseDetails(autoCourseCode, autoCourseName);
      // 🔥 Click save
      await dashboardPage.clickSaveCourse();
      // 🔥 Handle SUCCESS or DUPLICATE
      const duplicateError = page.locator('.toast, .alert', {
        hasText: /same code|already exists/i
      });
      const successMessage = page.locator('.toast, .alert', {
        hasText: /success|created/i
      });
      const result = await Promise.race([
        duplicateError.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'duplicate'),
        successMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'success'),
      ]).catch(() => 'unknown');
      // ❌ If duplicate → FAIL test
      if (result === 'duplicate') {
        throw new Error(`❌ Duplicate course detected for ${autoCourseCode}`);
      }
      // ❌ If nothing appears → FAIL
      if (result !== 'success') {
        throw new Error('❌ No success message detected');
      }
      console.log('✅ Course created successfully');
      // ✅ Verify in list
      await dashboardPage.goToCourseListFromForm();
      await dashboardPage.searchCourseInListByCode(autoCourseCode);
      const courseCard = page.locator('.box', { hasText: autoCourseCode }).first();
      await expect(courseCard).toBeVisible();
      await expect(courseCard).toContainText(autoCourseName);
    });*/
    // This test verifies that the course code field does not allow spaces and shows the appropriate error message.
     test('Cannot create course without name', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      const uniqueCourseCode = `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(uniqueCourseCode);
      await dashboardPage.clickSaveCourse();
      await expect(page.locator('.field-course-c_name .help-block-error')).toHaveText('Name cannot be blank.');
    });
    // This test verifies that the course name field does not allow empty values and shows the appropriate error message.
    test('Cannot create course without code', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      const uniqueCourseName = `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.clickSaveCourse();
      await expect(page.locator('.field-course-c_code .help-block-error')).toHaveText('Code cannot be blank.');
    });
    // This test verifies that the course code field does not allow spaces and shows the appropriate error message.
    test('Cannot create course with spaces in code', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      const invalidCourseCode = 'AUTO 123';
      const uniqueCourseName = `Course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const uniqueAvetmissCode = `AVET-${Date.now()}`;
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(invalidCourseCode);
      await dashboardPage.fillCreateCourseName(uniqueCourseName);
      await dashboardPage.fillAvetmissCourseDetails(uniqueAvetmissCode, uniqueCourseName);
      await dashboardPage.clickSaveCourse();
      await expect(page.locator('.field-course-c_code .help-block-error')).toHaveText(
        'Code can only contain letters, numbers, hyphens (-) and underscores (_). Spaces and special characters are not allowed.'
      );
    });
    // This test verifies that a course can be created with all major fields populated, including uploading an image and selecting competencies, and then verifies the course details after creation.
    test('create course with all major fields populated', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);
      const { duration, price, defaultTrainerName } = config.createCourseData;

      const filePath = path.join(
        process.cwd(),
        config.createCourseData.folder,
        config.createCourseData.image1
      );
      const uniqueCourseCode = `AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const uniqueCourseName = `Course-${Date.now()}-${Math.floor(Math.random() * 1000)} REG`;
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
      await expect(page.locator('#course-c_code')).toHaveValue(uniqueCourseCode);
      await expect(page.locator('#course-c_name')).toHaveValue(uniqueCourseName);
    });
    // This test verifies that all tooltips on the Create Course form appear with the correct text when triggered.
    test('verify all Create Course tooltips appear', async ({ page }) => {
      await openCreateCourseForm(page);
      const tooltipChecks = [
        {
          trigger: '.field-course-c_show_assessor_info a[data-toggle="popover"]',
          text: 'Allow students to see the assessor information on course page.',
          event: 'click'
        },
        {
          trigger: '.field-course-c_hide_nys_competency a[data-toggle="popover"]',
          text: 'Enable this setting to hide competencies that have not yet started from the student course page.',
          event: 'hover'
        }
      ];
    for (const item of tooltipChecks) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);

  const trigger = page.locator(item.trigger).first();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible();

  // 🔥 Handle all trigger types
  await trigger.hover().catch(() => {});
  await trigger.click().catch(() => {});
  await trigger.focus().catch(() => {});  // ✅ fixes your issue

  const popover = page.locator('.popover')
    .filter({ hasText: item.text });

  await expect(popover).toBeVisible({ timeout: 10000 });
}
    });
    // This test verifies that attempting to create a duplicate course with the same code and name shows the appropriate error message and prevents creation.
    test('cannot create duplicate course with same code and name', async ({ page }) => {
      const { dashboardPage } = await openCreateCourseForm(page);

      const duplicateCode = `DUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const duplicateName = `Duplicate-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(duplicateCode);
      await dashboardPage.fillCreateCourseName(duplicateName);
      await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
      await dashboardPage.saveCourseAndVerifySuccessToast();
      await dashboardPage.goToCourseListFromForm();
      await dashboardPage.clickCreateCourse();
      await dashboardPage.selectFirstCourseCategory();
      await dashboardPage.fillCreateCourseCode(duplicateCode);
      await dashboardPage.fillCreateCourseName(duplicateName);
      await dashboardPage.fillAvetmissCourseDetails(duplicateCode, duplicateName);
      await dashboardPage.clickSaveCourse();
      await expect(
        page.locator('.help-block-error, .alert, .toast', {
          hasText: /already exists|same code/i
        })
      ).toBeVisible();
    });
    // This test verifies that the course code and course name fields have the correct maximum length attributes set to prevent input beyond allowed limits.
    test('verify max length for course code and course name fields', async ({ page }) => {
      await openCreateCourseForm(page);
      await expect(page.locator('#course-c_code')).toHaveAttribute('maxlength', '150');
      await expect(page.locator('#course-c_name')).toHaveAttribute('maxlength', '200');
    });
  });
});