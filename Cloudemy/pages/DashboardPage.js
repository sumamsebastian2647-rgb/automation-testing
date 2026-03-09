const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // --- NAVIGATION ---
    this.courseManagementMenu = page.locator('#course_management > a');
    this.courselist = page.locator('#course_management ul.treeview-menu a[href="/course/index"]');
    this.competencyList = page.locator('#course_management ul.treeview-menu a[href="/competencies/index"]');
    this.assessmentList = page.locator('#course_management ul.treeview-menu a[href="/assessments/index"]');
    // --- SEARCH FILTERS ---
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
    this.createCompetencyButton = page.locator('a.btn.btn-success.btn-flat.pull-right[href="/competencies/create"]');
    this.createCompetencyCodeInput = page.locator('#competencies-comp_code');
    this.createCompetencyNameInput = page.locator('#competencies-comp_name');
    this.createCompetencyLearningMaterialInput = page.locator('#competencies-upload_file');
    this.createCompetencyScormMaterialInput = page.locator('#competencies-upload_file_scorm');
    this.createCompetencyCodeInputavtmis = page.locator('#competencies-comp_avetmiss_code');
    this.createCompetencyNameInputavtmis = page.locator('#competencies-comp_avetmiss_name');
    this.deliveryModeDropdown = page.locator('#competencies-vet_deliverymode');
    this.fundingSourceNationalDropdown = page.locator('#competencies-comp_funding_source_national');
    this.deliveryStrategyDropdown = page.locator('#competencies-wa_deliverymode');
    this.deliveryModeRAPTDropdown = page.locator('#competencies-deliverymodecodesrapt');
    this.fundingSourceStateDropdown = page.locator('#competencies-comp_funding_source_state');
    this.deliveryModeAVETMISSDropdown = page.locator('#competencies-deliverymodecodesavetmiss');
    this.predominantDeliveryModeDropdown = page.locator('#competencies-predominant_delivery_mode');
    // Nominal Hours
    this.nominalHoursInput = page.locator('#competencies-nominalhours');
    this.scheduledHoursInput = page.locator('#competencies-scheduled_hours');
    this.deliveryProviderABNInput = page.locator('#competencies-comp_delivery_provider_abn');
    this.workplaceABNInput = page.locator('#competencies-comp_workplace_abn');
    this.studentContributionAmountInput = page.locator('#competencies-comp_student_contribution_amount');
    this.studentContributionAmountOtherInput = page.locator('#competencies-comp_student_contribution_amount_other');
    this.employerContributionAmountInput = page.locator('#competencies-comp_employer_contribution_amount');
    this.saveCompetencyButton = page.locator('div.box-footer > button[type="submit"].btn.btn-success.btn-flat');
    this.competencySuccessToastCombined = page.getByText(/Well Done![\s\S]*Competency has been created successfully\./i);
    this.competencySearchCodeInput = page.locator('input[name="CompetenciesSearch[comp_code]"]').filter({ visible: true });
    this.competencySearchNameInput = page.locator('input[name="CompetenciesSearch[comp_name]"]').filter({ visible: true });
   this.checklistRows = page.locator('#rplActivityChecklist table tbody tr:not(#new-checklist-template)');
   this.assessmentSuccessToastCombined = page.getByText(/Well Done![\s\S]*Record has been saved.\./i);
   this.checklistInputs = this.checklistRows.locator(
'input[name="CompetencyRplChecklist[new_checklist][]"]'
);
 this.addChecklistButton = page.locator('#add-checklist-btn');
    this.inactivateButton = page.locator('a[title="inactivate"]');
    this.reactivateButton = page.locator('a[title="activate"]');
    this.okButton = page.getByRole('button', { name: 'Ok' });
 // Select2 visible container
  this.competencyDropdown = page.locator(
    '#select2-clustercompetency-comp_code-container'
  );

  // Select2 search input (appears after click)
  this.select2SearchInput = page.locator(
    '.select2-container--open .select2-search__field'
  );
    this.paginationLinks = page.locator('ul.pagination li a');
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

  async navigateToCompetencyList() {
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
        '#course_management ul.treeview-menu a[href="/competencies/index"]'
      );
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });
    await this.competencyList.first().click({ force: true });
    await this.page.waitForURL(/competencies\/index/, { timeout: 10000 });
  }

  async clickCreateCompetency() {
    await expect(this.createCompetencyButton).toBeVisible({ timeout: 15000 });
    await this.createCompetencyButton.click();
    await this.page.waitForURL(/competencies\/create/, { timeout: 10000 });
  }

  async fillCreateCompetencyCode(competencyCode) {
    await expect(this.createCompetencyCodeInput).toBeVisible({ timeout: 10000 });
    await this.createCompetencyCodeInput.fill(competencyCode);
  }

  async fillCreateCompetencyName(competencyName) {
    await expect(this.createCompetencyNameInput).toBeVisible({ timeout: 10000 });
    await this.createCompetencyNameInput.fill(competencyName);
  }

  async fillCreateCompetencyCodeavtmiss(competencyCode) {
    await expect(this.createCompetencyCodeInputavtmis).toBeVisible({ timeout: 10000 });
    await this.createCompetencyCodeInputavtmis.fill(competencyCode);
  }

  async fillCreateCompetencyNameavtmiss(competencyName) {
    await expect(this.createCompetencyNameInputavtmis).toBeVisible({ timeout: 10000 });
    await this.createCompetencyNameInputavtmis.fill(competencyName);
  }

  async uploadCompetencyLearningMaterial(filePath) {
    await expect(this.createCompetencyLearningMaterialInput).toBeAttached({ timeout: 10000 });
    await this.createCompetencyLearningMaterialInput.setInputFiles(filePath);
  }

  async uploadCompetencyScormMaterial(filePath) {
    await expect(this.createCompetencyScormMaterialInput).toBeAttached({ timeout: 10000 });
    await this.createCompetencyScormMaterialInput.setInputFiles(filePath);
  }

  async selectDeliveryMode(value) {
    await this.deliveryModeDropdown.selectOption(value);
  }

  async selectFundingSourceNational(value) {
    await this.fundingSourceNationalDropdown.selectOption(value);
  }

  async selectDeliveryStrategy(value) {
    await this.deliveryStrategyDropdown.selectOption(value);
  }
async selectMultipleDeliveryModeRAPT(values) {
  await this.deliveryModeRAPTDropdown.waitFor({ state: 'attached' });

  await this.deliveryModeRAPTDropdown.selectOption(values, {
    force: true
  });
}
async selectFundingSourceState(value) {
  await this.fundingSourceStateDropdown.waitFor({ state: 'attached' });

  await this.fundingSourceStateDropdown.selectOption(value, {
    force: true
  });
}
async selectDeliveryModeAVETMISS(values) {
  await this.selectSelect2Multiple(
    this.deliveryModeAVETMISSDropdown,
    values
  );
}
async selectPredominantDeliveryMode(value) {
  await this.predominantDeliveryModeDropdown.waitFor({
    state: 'visible'
  });

  await this.predominantDeliveryModeDropdown.selectOption(value);
}
  async fillNominalHours(value) {
    await this.nominalHoursInput.fill(value);
  }

  async fillScheduledHours(value) {
    await this.scheduledHoursInput.fill(value);
  }

  async fillDeliveryProviderABN(value) {
    await this.deliveryProviderABNInput.fill(value);
  }

  async fillWorkplaceABN(value) {
    await this.workplaceABNInput.fill(value);
  }

  async fillStudentContributionAmount(value) {
    await this.studentContributionAmountInput.fill(value);
  }

  async fillStudentContributionAmountOther(value) {
    await this.studentContributionAmountOtherInput.fill(value);
  }

  async fillEmployerContributionAmount(value) {
    await this.employerContributionAmountInput.fill(value);
  }

  async selectSelect2Multiple(locator, values) {
    if (!Array.isArray(values)) {
      throw new Error('❌ Values must be an array for multi-select.');
    }
    await locator.selectOption(values, { force: true });
  }
async addRplChecklist(checklistName) {
  await this.addChecklistButton.click();

  const visibleInput = this.page.locator(
    '#rplActivityChecklist table tbody tr:not(#new-checklist-template) input[name="CompetencyRplChecklist[new_checklist][]"]'
  ).last();

  await visibleInput.waitFor({ state: 'visible' });
  await visibleInput.fill(checklistName);
}


async selectClustered(value) {
  await this.page.locator(
    `#competencies-is_clustered input[value="${value}"]`
  ).locator('xpath=ancestor::div[contains(@class,"iradio")]')
   .click();
}

async selectFirstTwoCompetencies() {
  const values = await this.page.$$eval(
    '#clustercompetency-comp_code option',
    options =>
      options
        .filter(o => o.value !== '')
        .slice(0, 2)
        .map(o => o.value)
  );

  await this.page.locator('#clustercompetency-comp_code')
    .selectOption(values, { force: true });

  // Trigger change so Select2 updates UI
  await this.page.evaluate(() => {
    const select = document.querySelector('#clustercompetency-comp_code');
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}


  async clickSaveCompetency() {
    await expect(this.saveCompetencyButton).toBeVisible({ timeout: 10000 });
    await this.saveCompetencyButton.click();
  }

  async saveCompetencyAndVerifySuccessToast() {
    await this.clickSaveCompetency();
    await expect(this.competencySuccessToastCombined).toBeVisible({ timeout: 15000 });
  }

  async searchCompetencyInList(code, name) {
    if (code) {
      await expect(this.competencySearchCodeInput).toBeVisible({ timeout: 10000 });
      await this.competencySearchCodeInput.fill(code);
      await this.page.keyboard.press('Enter');
    }
    if (name) {
      await expect(this.competencySearchNameInput).toBeVisible({ timeout: 10000 });
      await this.competencySearchNameInput.fill(name);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForLoadState('networkidle');
  }
//////////////////////////////////////////////////////////////////////
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
  await this.createCourseCodeInput.waitFor({ state: 'visible' });
  await this.createCourseCodeInput.scrollIntoViewIfNeeded();
  await this.createCourseCodeInput.fill(courseCode);
}
async fillCreateCourseName(courseName) {
  await this.createCourseNameInput.waitFor({ state: 'visible' });
  await this.createCourseNameInput.fill(courseName);
}

async selectCreateCourseType(typeValue) {
  await this.createCourseTypeSelect.waitFor({ state: 'visible' });
  await this.createCourseTypeSelect.selectOption(typeValue);
}

async fillCreateCourseDuration(durationValue) {
  await this.createCourseDurationInput.waitFor({ state: 'visible' });
  await this.createCourseDurationInput.fill(durationValue);
}

async fillCreateCoursePrice(priceValue) {
  await this.createCoursePriceInput.waitFor({ state: 'visible' });
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
  await this.ավետmissCourseCodeInput.waitFor({ state: 'visible' });
  await this.ավետmissCourseCodeInput.scrollIntoViewIfNeeded();
  await this.ավետmissCourseCodeInput.fill(courseCode);

  await this.ավետmissCourseNameInput.waitFor({ state: 'visible' });
  await this.ավետmissCourseNameInput.scrollIntoViewIfNeeded();
  await this.ավետmissCourseNameInput.fill(courseName);
}

async saveCourseAndVerifySuccessToast() {
  await this.clickSaveCourse();
 await expect(this.successToastCombined).toHaveText(/success|created|updated/i, {
  timeout: 15000
});
}
async saveCourseAndValidateResult() {
  await this.clickSaveCourse();

  const toast = this.page.locator('body');

  await expect(toast).toContainText(
    /success|created|updated|same code and name exists/i,
    { timeout: 15000 }
  );

  const pageText = await toast.innerText();

  if (/success|created|updated/i.test(pageText)) {
    console.log("✅ Course created successfully");
  } 
  else if (/same code and name exists/i.test(pageText)) {
    console.log("⚠️ Duplicate course detected");
  } 
  else {
    throw new Error("Unexpected message appeared.");
  }
}async clickSaveCourse() {
  await this.saveCourseButton.waitFor({ state: 'visible' });
  await this.saveCourseButton.click({ trial: true }); // checks actionability
  await this.saveCourseButton.click();
}

async saveUpdatedCourseAndVerifySuccessToast() {
  await this.clickSaveCourse();
  await this.updateSuccessToastCombined.waitFor({ state: 'visible' });
  await expect(this.updateSuccessToastCombined).toContainText('updated');
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
await expect(this.page).toHaveURL(/course\/index/, {
  timeout: 10000
});
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



/////////////////////////////////////////////////////////////////////////
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
      .locator('.box')
      .filter({ hasText: courseName })
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
  //////////////////////////////assessment page functions
 
   async navigateToAssessmentList() {
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
        '#course_management ul.treeview-menu a[href="/assessments/index"]'
      );
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });
    await this.assessmentList.first().click({ force: true });
    await this.page.waitForURL(/assessments\/index/, { timeout: 10000 });
  }
  async  clickCreateAssessment() {
  await this.page.getByRole('link', { name: 'Create Assessment' }).waitFor({ timeout: 10000 });
  await this.page.getByRole('link', { name: 'Create Assessment' }).click();
  // Optional: wait for navigation
  await this.page.waitForURL('**/assessments/selecttype');
  }
  async selectAssessmentType(type) {
  await this.page.locator(`a[href="${type}"]`).click();
  }
  async selectFirstCompetency() {
    await this.page.locator('#select2-assessments-ass_comp_id-container').click();
    await this.page.locator('.select2-results__option').first().waitFor();
    await this.page.locator('.select2-results__option').first().click();
  }
  generateUniqueValue(prefix) {
    return `${prefix}-${Date.now()}`;
  }
  async enterAssessmentCode(prefix = 'ASS') {
    const code = this.generateUniqueValue(prefix);
    await this.page.locator('#assessments-ass_code').fill(code);
    return code;
  }
  async enterAssessmentName(prefix = 'Assessment') {
    const name = this.generateUniqueValue(prefix);
    await this.page.locator('#assessments-ass_name').fill(name);
    return name;
  }
  async enterInstruction(text) {
  const editor = this.page.locator(
    '.field-assessments-ass_description .redactor-editor'
  );

  await editor.click();
  await editor.fill(text);
}
  async saveAssessmentAndVerifySuccess() {
  await this.clickSaveCompetency();
  await expect(this.page).toHaveURL(/updatelongquestion\?id=\d+/);
  await expect(this.page.locator('#assessments-ass_code')).toBeVisible();
}
async clickManageQuestions() {
  await this.page.getByTitle('Manage Questions').click();
}
async openCreateQuestionsDropdown() {
  await this.page.getByRole('button', { name: /Create Questions/i }).click();
}

async addQuestionType(type) {
  await this.openCreateQuestionsDropdown();
  await this.page.getByRole('link', { name: type }).click();
}

async enterQuestionTitle(title) {
  const textarea = this.page.locator('#questions-ques_title');

  await textarea.waitFor({ state: 'attached' });

  await textarea.evaluate((el, value) => {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, title);
}
async enterModelAnswer(answer) {
  const textarea = this.page.locator('#questions-ques_model_answer');

  await textarea.waitFor({ state: 'attached' });

  await textarea.evaluate((el, value) => {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, answer);
}
async uploadQuestionFile(filePath) {
  await this.page.setInputFiles('#questions-upload_file', filePath);
}
 async saveQuestionAndVerifySuccess() {
  await this.clickSaveCompetency();
  // verify page reload with same question page
  await expect(this.page).toHaveURL(/questions\/longquestion\?id=\d+/);
  // verify form still visible (means save succeeded)
  //await expect(this.page.locator('#questions-ques_title')).toBeVisible();
}
async clickSave() {
  const saveButton = this.page.locator('.box-footer button:has-text("Save")');

  await saveButton.click();

  await this.page.waitForLoadState('domcontentloaded');
}
async clickManageQuestionsPQ() {
  await this.page.getByTitle('Manage Observations').click();
}
async clickAddPracticalObservation() {
  await this.page.getByRole('link', { name: 'Add Practical Observation' }).click();
}
 async saveQuestionAndVerifySuccesspq() {
  await this.clickSaveCompetency();
  // verify page reload with same question page
  await expect(this.page).toHaveURL(/questions\/workplacepractical\?id=\d+/);
  // verify form still visible (means save succeeded)
  //await expect(this.page.locator('#questions-ques_title')).toBeVisible();
}
async saveAssessmentAndVerifySuccesspq() {
  await this.clickSaveCompetency();
  await expect(this.page).toHaveURL(/updateworkplacepractical\?id=\d+/);
  await expect(this.page.locator('#assessments-ass_code')).toBeVisible();
}
async saveQuestionAndVerifySuccessaq() {
  await this.clickSaveCompetency();
  // verify page reload with same question page
  await expect(this.page).toHaveURL(/questions\/automaticquiz\?id=\d+/);
  // verify form still visible (means save succeeded)
  //await expect(this.page.locator('#questions-ques_title')).toBeVisible();
}
async saveAssessmentAndVerifySuccessaq() {
  await this.clickSaveCompetency();
  await expect(this.page).toHaveURL(/updateautomaticquiz\?id=\d+/);
  await expect(this.page.locator('#assessments-ass_code')).toBeVisible();
}
}

module.exports = { DashboardPage };