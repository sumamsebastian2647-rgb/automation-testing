// Pages/DashboardPage.js
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // --- NAVIGATION (UNCHANGED AS YOU ASKED) ---
    this.courseManagementMenu = page.locator('#course_management > a'); 
    this.courselist = page.locator( '#course_management ul.treeview-menu a[href="/course/index"]' );

    // --- SEARCH FILTERS (UPDATED using getByLabel) ---
    this.categorySelect = page.getByLabel('Category');
    this.codeInput = page.getByLabel('Code');
    this.nameInput = page.getByLabel('Name');
    this.typeSelect = page.getByLabel('Type');
    this.priceInput = page.getByLabel('Price (AUD)');

    // Buttons
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('link', { name: 'Reset' });
    this.backBtn = page.getByRole('link', { name: 'Back' }).first();

    // Create / Active / Inactive / Actions
    this.createButton = page.getByRole('link', { name: 'Create Course Category' });
    this.createCourseButton = page.getByRole('link', { name: 'Create Course' });
    this.createCourseCategorySelect = page.locator('#course-c_cat_id');
    this.createCourseCodeInput = page.locator('#course-c_code');
    this.createCourseNameInput = page.locator('#course-c_name');
    this.createCourseTypeSelect = page.locator('#course-c_type');
    this.createCourseDurationInput = page.locator('#course-c_duration');
    this.createCoursePriceInput = page.locator('#course-c_price');
    this.createCourseDefaultTrainerSelect = page.locator('#course-c_default_trainer');
    this.createCourseImageInput = page.locator('#course-upload_file');
    this.ավետmissCourseCodeInput = page.locator('#course-avetmiss_course_code');
    this.ավետmissCourseNameInput = page.locator('#course-avetmiss_course_name');
    this.saveCourseButton = page.locator('div.box-footer > button[type="submit"].btn.btn-success.btn-flat');
    this.successToastCombined = page.getByText(/Well Done![\s\S]*Course has been added successfully/i);
    this.updateSuccessToastCombined = page.getByText(/Well Done![\s\S]*Course has been (updated|added) successfully/i);
    this.cloneSuccessToast = page.getByText(/Well Done![\s\S]*Course cloned successfully\. You can now modify the cloned course\./i);
    this.courseListCodeSearchInput = page.locator('#coursesearch-c_code');
    this.courseListSearchButton = page.getByRole('button', { name: 'Search' });
    this.trainingGovCourseSearchInput = page.locator('#txtGetCourse');
    this.trainingGovCourseSearchButton = page.locator('#btnSearch');
    this.trainingGovCourseResults = page.locator('#courselist');
    this.coreCompetencyMultiSelect = page.locator('#compcorelist');
    this.electiveCompetencyMultiSelect = page.locator('#compeleclist');
    this.showInactiveLink = page.getByRole('link', { name: 'Show Inactive Course Categories' });
    this.showActiveLink = page.getByRole('link', { name: 'Show Active Course Categories' });
    this.firstCourseUpdateButton = page.locator('.box .box-footer a[title="update"]').first();
    this.firstCourseCloneButton = page.locator('.box .box-footer a.clone-course-btn').first();
    this.confirmCloneButton = page.getByRole('button', { name: 'Yes, clone it!' });

    this.inactivateButton = page.locator('a[title="inactivate"]');
    this.reactivateButton = page.locator('a[title="activate"]');
    this.okButton = page.getByRole('button', { name: 'Ok' });

    this.paginationLinks = page.locator('ul.pagination li a');

    // Results
    this.courseCategoryLinkByName = (name) =>
      page.getByRole('link', { name, exact: true });
  }
// ------------------------------------------------- 
// NAVIGATION
// -------------------------------------------------
async navigateToCourseCategory() {
  console.log('📂 Navigating to Course Mnagement Module...');

  await this.page.waitForSelector('#course_management', { timeout: 20000 });
  const courseManagementContainer = this.page.locator('#course_management');

  await expect(this.courseManagementMenu).toBeVisible({ timeout: 15000 });

  for (let attempt = 1; attempt <= 2; attempt++) {
    const menuExpanded = await courseManagementContainer.evaluate(el =>
      el.classList.contains('menu-open')
    );

    if (menuExpanded) break;

    await this.courseManagementMenu.scrollIntoViewIfNeeded();
    await this.courseManagementMenu.click({ force: true });
    await this.page.waitForTimeout(800);

    const nowExpanded = await courseManagementContainer.evaluate(el =>
      el.classList.contains('menu-open')
    );

    if (nowExpanded) break;

    if (attempt === 2)
      throw new Error('❌ Failed to expand Course Management menu.');
  }

  await this.page.waitForFunction(() => {
    const el = document.querySelector(
      '#course_management ul.treeview-menu a[href="/course/index"]'
    );
    return el && el.offsetParent !== null;
  }, { timeout: 10000 });
  await this.courselist.scrollIntoViewIfNeeded();
  await this.courselist.click({ force: true });
  await this.page.waitForURL(/course\/index/, { timeout: 10000 });
  console.log('✅ Successfully navigated to Course page!');
}

async clickCreateCourse() {
  await expect(this.createCourseButton).toBeVisible({ timeout: 10000 });
  await this.createCourseButton.click();
  await this.page.waitForURL(/course\/create/, { timeout: 10000 });
}

async selectFirstCourseCategory() {
  await expect(this.createCourseCategorySelect).toBeVisible({ timeout: 10000 });
  await this.createCourseCategorySelect.selectOption({ index: 0 });
}

async fillCreateCourseCode(courseCode) {
  await expect(this.createCourseCodeInput).toBeVisible({ timeout: 10000 });
  await this.createCourseCodeInput.fill(courseCode);
}

async fillCreateCourseName(courseName) {
  await expect(this.createCourseNameInput).toBeVisible({ timeout: 10000 });
  await this.createCourseNameInput.fill(courseName);
}

async selectCreateCourseType(typeValue) {
  await expect(this.createCourseTypeSelect).toBeVisible({ timeout: 10000 });
  await this.createCourseTypeSelect.selectOption(typeValue);
}

async fillCreateCourseDuration(durationValue) {
  await expect(this.createCourseDurationInput).toBeVisible({ timeout: 10000 });
  await this.createCourseDurationInput.fill(durationValue);
}

async fillCreateCoursePrice(priceValue) {
  await expect(this.createCoursePriceInput).toBeVisible({ timeout: 10000 });
  await this.createCoursePriceInput.fill(priceValue);
}

async selectCreateCourseDefaultTrainer(trainerName) {
  await expect(this.createCourseDefaultTrainerSelect).toBeAttached({ timeout: 10000 });
  await this.createCourseDefaultTrainerSelect.selectOption(
    { label: trainerName },
    { force: true }
  );
}

async uploadCreateCourseImage(imageFilePath) {
  await expect(this.createCourseImageInput).toBeAttached({ timeout: 10000 });
  await this.createCourseImageInput.setInputFiles(imageFilePath);
}

async fillAvetmissCourseDetails(courseCode, courseName) {
  await expect(this.ավետmissCourseCodeInput).toBeVisible({ timeout: 10000 });
  await this.ավետmissCourseCodeInput.fill(courseCode);

  await expect(this.ավետmissCourseNameInput).toBeVisible({ timeout: 10000 });
  await this.ավետmissCourseNameInput.fill(courseName);
}

async saveCourseAndVerifySuccessToast() {
  await this.clickSaveCourse();

  await expect(this.successToastCombined).toBeVisible({ timeout: 15000 });
}

async clickSaveCourse() {
  await expect(this.saveCourseButton).toBeVisible({ timeout: 10000 });
  await this.saveCourseButton.click();
}

async saveUpdatedCourseAndVerifySuccessToast() {
  await this.clickSaveCourse();
  await expect(this.updateSuccessToastCombined).toBeVisible({ timeout: 15000 });
}

async openFirstCourseForEditFromList() {
  await expect(this.firstCourseUpdateButton).toBeVisible({ timeout: 10000 });
  await this.firstCourseUpdateButton.click();
  await this.page.waitForURL(/course\/update\?id=\d+/, { timeout: 10000 });
}

async openFirstCourseForCloneFromList() {
  await expect(this.firstCourseCloneButton).toBeVisible({ timeout: 10000 });
  await this.firstCourseCloneButton.click();

  // Clone action opens a confirmation dialog first
  await expect(this.confirmCloneButton).toBeVisible({ timeout: 10000 });
  await this.confirmCloneButton.click();

  // Clone toast appears before clone form is shown
  await expect(this.cloneSuccessToast).toBeVisible({ timeout: 15000 });

  // After confirmation, clone form loads with copied values
  await this.page.waitForURL(/course\/(create|update\?id=\d+)/, { timeout: 15000 });
  await expect(this.createCourseCodeInput).toBeVisible({ timeout: 15000 });
}

async saveClonedCourseAndVerifySaved() {
  await this.clickSaveCourse();
  await this.page.waitForURL(/course\/update\?id=\d+/, { timeout: 15000 });
  await expect(this.createCourseCodeInput).toBeVisible({ timeout: 10000 });
}

async goToCourseListFromForm() {
  // If already on list page, nothing to do
  if (/\/course\/index/.test(this.page.url())) {
    return;
  }

  // Preferred route: use Back button when present on form pages
  if (await this.backBtn.isVisible().catch(() => false)) {
    await this.backBtn.click();
    await this.page.waitForURL(/course\/index/, { timeout: 10000 });
    return;
  }

  // Fallback for pages where Back link is missing/not rendered
  await this.navigateToCourseCategory();
}

async searchCourseInListByCode(courseCode) {
  await expect(this.courseListCodeSearchInput).toBeVisible({ timeout: 10000 });
  await this.courseListCodeSearchInput.fill(courseCode);
  await this.courseListSearchButton.click();
  await this.page.waitForLoadState('networkidle');
}

async searchTrainingGovCourseAndSelectFirst(searchTerm) {
  await expect(this.trainingGovCourseSearchInput).toBeVisible({ timeout: 10000 });
  await this.trainingGovCourseSearchInput.fill(searchTerm);
  await this.trainingGovCourseSearchButton.click();

  await this.page.waitForFunction(() => {
    const select = document.querySelector('#courselist');
    if (!select) return false;
    return select.options.length > 1 || (select.options.length === 1 && select.options[0].value !== '');
  }, { timeout: 15000 });

  const optionIndexToSelect = await this.trainingGovCourseResults.evaluate((selectEl) => {
    const options = Array.from(selectEl.options);
    if (options.length === 0) return -1;
    return options[0].value === '' && options.length > 1 ? 1 : 0;
  });

  if (optionIndexToSelect < 0) {
    throw new Error('No training.gov.au course results found to select.');
  }

  await this.trainingGovCourseResults.selectOption({ index: optionIndexToSelect });
}

async selectCoreCompetenciesOneToThree() {
  await expect(this.coreCompetencyMultiSelect).toBeAttached({ timeout: 10000 });

  const selectedCompetencies = await this.coreCompetencyMultiSelect.evaluate((selectEl) => {
    const select = selectEl;
    const optionsOneToThree = Array.from(select.options).slice(0, 3);

    Array.from(select.options).forEach(option => {
      option.selected = false;
    });

    optionsOneToThree.forEach(option => {
      option.selected = true;
    });

    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    return optionsOneToThree.map(option => option.textContent?.trim()).filter(Boolean);
  });

  return selectedCompetencies;
}

async selectElectiveCompetenciesFourToSix() {
  await expect(this.electiveCompetencyMultiSelect).toBeAttached({ timeout: 10000 });

  const selectedCompetencies = await this.electiveCompetencyMultiSelect.evaluate((selectEl) => {
    const select = selectEl;
    const optionsFourToSix = Array.from(select.options).slice(3, 6);

    Array.from(select.options).forEach(option => {
      option.selected = false;
    });

    optionsFourToSix.forEach(option => {
      option.selected = true;
    });

    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    return optionsFourToSix.map(option => option.textContent?.trim()).filter(Boolean);
  });

  return selectedCompetencies;
}


  // -------------------------------------------------
  // SEARCH FUNCTIONS (UPDATED)
  // -------------------------------------------------

  async searchByCategory(value) {
    await this.categorySelect.selectOption(value);
    await this.searchBtn.click();
  }

  async searchByCode(code) {
    await this.codeInput.fill(code);
    await this.searchBtn.click();
  }

  async searchByName(name) {
    await this.nameInput.fill(name);
    await this.searchBtn.click();
  }

  async searchByType(value) {
    await this.typeSelect.selectOption(value);
    await this.searchBtn.click();
  }

  async searchByPrice(price) {
    await this.priceInput.fill(price);
    await this.searchBtn.click();
  }

  // -------------------------------------------------
  // RESULT ACTIONS
  // -------------------------------------------------

  async openCategory(name) {
    await this.courseCategoryLinkByName(name).click();
  }
  async verifyCourseByCode(courseCode) {
      // Course code usually appears in the course card (adjust selector if needed)
      const matches = await this.page
        .locator('.box')
        .filter({ hasText: courseCode })
        .count();
      if (matches > 0) {
        console.log(`✅ Course Code "${courseCode}" found (${matches} match/es)`);
        return true;
      } else {
        console.log(`❌ Course Code "${courseCode}" NOT found`);
        return false;
      }
  }
  async verifyCourseByName(courseName) {
      const matches = await this.page
        .locator('.box')                 // course cards wrapper
        .filter({ hasText: courseName }) // match the name
        .count();
      if (matches > 0) {
        console.log(`✅ Course name "${courseName}" found (${matches} matches)`);
        return true;
      } else {
        console.log(`❌ Course name "${courseName}" NOT found`);
        return false;
      }
  }
  async openCourseByType(courseName) {
    const course = this.page
      .locator('.box .label.label-info')
      .filter({ hasText: courseName })
      .first();
    const exists = await course.count();
    if (!exists) {
      throw new Error(`❌ Course "${courseName}" not found after filtering by type`);
    }
    console.log(`📂 Opening course: ${courseName}`);
    await course.click();
    await this.page.waitForLoadState('networkidle');
  }
  async reset() {
    await this.resetBtn.click();
  }

  async clickBack() {
    await this.backBtn.click();
  }
}

module.exports = { DashboardPage };
