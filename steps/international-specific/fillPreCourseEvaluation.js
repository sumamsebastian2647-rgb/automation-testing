/**
 * Pre-course evaluation enrollment step module
 * @module steps/fillPreCourseEvaluation
 * 
 * Import from: require('../steps/fillPreCourseEvaluation')
 * 
 * @example
 * const { fillPreCourseEvaluation } = require('../steps/fillPreCourseEvaluation');
 * await fillPreCourseEvaluation(page);
 */

const { config } = require('../../config/config.js');

async function selectSelect2(page, containerId, optionText, searchText = optionText) {
  const selection = page
    .locator(`#${containerId}`)
    .locator('xpath=ancestor::span[contains(@class,"select2-selection")]');
  
  await selection.waitFor({ state: 'attached', timeout: 10000 });
  await selection.scrollIntoViewIfNeeded();
  await selection.click({ force: true });
  
  const searchBox = page.locator('.select2-dropdown .select2-search__field');
  await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  await searchBox.fill(searchText);
  
  const option = page
    .locator('.select2-results__option')
    .filter({ hasText: optionText })
    .first();

  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.click();
}

/**
 * Fills the comprehensive pre-course evaluation form
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function fillPreCourseEvaluation(page) {
  await page.waitForTimeout(config.timeouts.medium);
  
  // Country of Birth
  await selectSelect2(
    page,
    'select2-txtCountryofbirth-container',
    'Australia'
  );
  await page.locator('#txtCityofbirth').fill('Sydney');
  
  // Country of Citizenship
  await selectSelect2(
    page,
    'select2-txtCountryofCitizen-container',
    'Australia'
  );

  // Australian Citizenship Status
  await selectSelect2(
    page,
    'select2-txtAusCitizeshipStatus-container',
    'Australian Citizen'
  );
  
  // Indigenous status → No, Neither
  await page
    .locator(
      'xpath=//input[@name="txtAboriginalorTorresStraightIslander" and @value="4"]/ancestor::*[contains(@class,"icheck") or contains(@class,"iradio")]'
    )
    .click();
  
  // Employment Status
  await page
    .locator('#txtEmployeeStatus')
    .selectOption({ value: '03' });
  
  // Occupation
  await selectSelect2(
    page,
    'select2-txtAnzsco-container',
    'Accountant (General) (221111)',
    'Accountant'
  );
  
  // Industry
  await selectSelect2(
    page,
    'select2-txtAnzsci-container',
    'Accommodation (44)',
    'Accommodation'
  );
  
  // First Language
  await selectSelect2(
    page,
    'select2-txtFirstLanguage-container',
    'AUSTRALIAN INDIGENOUS LANGUAGES',
    'AUSTRALIAN INDIGENOUS LANGUAGES'
  );
  
  // Proficiency in English
  await page.getByLabel('Proficiency in English?').selectOption('1');
  
  // English Support
  await page.getByLabel('English Support?').selectOption('Y');
  
  // Attending School
  await page.getByLabel('Attending school?').selectOption('1');
  await page.getByLabel('School Name *').fill('Test School');
  
  // School Level
  await page.getByLabel('Highest Completed School Level').selectOption('12');
  await page.getByLabel('Completion year').fill('2000');
  await page.locator('.txtPriorEducationFlag > .iradio_flat-red > .iCheck-helper').first().click();
  await page.locator('#txtCurrentlyEnrolled').locator('xpath=following-sibling::span').click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.locator('//label[contains(.,"Have you previously completed a qualification funded under the JobTrainer Fund?")]/following-sibling::div//label[.//text()[contains(.,"No")]]').click();
  await page.locator('input[name="txtJobSeeker"][value="1"]').locator('xpath=ancestor::label').click();
  await page.locator('input[name="txtJobEvidenceType[]"][value="1"]').locator('xpath=ancestor::label').click();
  await page.setInputFiles('#fileEvidenceTrainerFund', 'attachments/' + config.documents.concessionCard);
  //await page.setInputFiles('#fileEvidenceTrainerFund', config.documents.concessionCard);
  await page.locator('input[name="txtSchoolLeaver"][value="1"]').locator('xpath=ancestor::label').click();
  await page.selectOption('#txtReason', {label: 'To get a job (01)'});
  await page.getByRole('button', { name: 'Next' }).click();
}

module.exports = {
  fillPreCourseEvaluation
};
