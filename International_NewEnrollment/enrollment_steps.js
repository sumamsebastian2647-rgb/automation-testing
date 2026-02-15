// enrollmentSteps.js
const { config } = require('./config');
const { expect } = require('@playwright/test');
function generatePersonalFiller(personalData) {
  return async function (page) {
    await page.getByRole('textbox', { name: 'First Name/Given Names *' }).waitFor({ timeout: 10000 });
    await page.getByRole('combobox', { name: 'Title *' }).selectOption(personalData.title); // e.g., "Mr"
    await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personalData.firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(personalData.middleName || '');
    await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personalData.lastName);
    await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personalData.dob);
    await page.getByText(personalData.gender).click();
    await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personalData.phone);
    await page.getByRole('textbox', { name: /^Email\b/i }).fill(personalData.email);
    await page.getByRole('textbox', { name: /^Confirm Email\b/i }).fill(personalData.email);
    await page.getByRole('textbox', { name: 'Username *' }).fill(personalData.username);
    await page.getByLabel(personalData.gender).check(); // 'Female', 'Male', or 'Other'
    await page.getByRole('button', { name: 'Next' }).click();
    await page.setInputFiles('#fileStudentPhotoUpload', config.documents.photo);
  };
}
const fillPersonalDetails1 = generatePersonalFiller(config.personal1);
const fillPersonalDetails2 = generatePersonalFiller(config.personal2);
const fillPersonalDetails3 = generatePersonalFiller(config.personal3);
const fillPersonalDetails4 = generatePersonalFiller(config.personal4);
const fillPersonalDetails5 = generatePersonalFiller(config.personal5);
async function fillResidentialDetails(page) {
  const { residential } = config;
  await page.waitForTimeout(10000);
  await page.getByRole('textbox', { name: 'Building Name' }).fill(residential.building);
  await page.locator('#txtFlatUnit').fill(residential.unit);
  await page.locator('#txtStreetNo').fill(residential.streetNo);
  await page.getByRole('textbox', { name: 'Street name *' }).fill(residential.streetName);
  await page.locator('input[name="txtPoBox"]').fill(residential.poBox);
  await page.getByRole('textbox', { name: 'Suburb *' }).fill(residential.suburb);
  await page.getByText(residential.suburbSelect).click({force: true});
  await page.locator('#select2-txtStateterritory-container').click();
  await page.getByRole('option', { name: residential.state }).click();
  await page.locator('#select2-txtCountry-container').click();
  await page.getByRole('option', { name: residential.country, exact: true }).click();
  await page.getByRole('link', { name: 'Same as Above' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillContactInformation(page) {
  const c = config.contact;
  await page.getByRole('textbox', { name: 'Home Phone' }).fill(c.homePhone);
  await page.getByRole('textbox', { name: 'Work Phone' }).fill(c.workPhone);
  await page.getByRole('textbox', { name: 'Emergency Contact Name' }).fill(c.emergencyName);
  await page.getByRole('textbox', { name: 'Relationship' }).fill(c.relationship);
  await page.getByRole('textbox', { name: 'Emergency Contact Number' }).fill(c.emergencyPhone);
  await page.getByRole('textbox', { name: 'Emergency Contact Email' }).fill(c.emergencyEmail);
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillEmployerDetails(page) {
  const e = config.employer;
  await page.getByRole('textbox', { name: /Australian Business Number/i }).fill(e.abn);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(config.timeouts.medium);
  await page.getByRole('textbox', { name: 'Contact Person Name' }).fill(e.contactName);
  await page.getByRole('textbox', { name: 'Contact Person Email' }).fill(e.contactEmail);
  await page.getByRole('textbox', { name: 'Contact Person Phone Number' }).fill(e.contactPhone);
  await page.getByRole('button', { name: 'Next' }).click();
}
/**
 * Fills visa and arrival information in a form
 * @param {Page} page - Playwright page object
 * @param {Object} [visaData=config.visa] - Visa and arrival data
 * @returns {Promise<void>}
 */
async function fillVisaAndArrivalInfo(page, visaData) {
      const data = visaData || config.visa;
      await page.waitForTimeout(2000);
      // Nationality
      await page.locator('#select2-txtVCountryofCitizen-container').click();
      await page.getByRole('option', { name: data.nationality, exact: true }).click();
      // Country of Birth
      await page.locator('#select2-txtVCountryofbirth-container').click();
      await page.getByRole('option', { name: data.countryOfBirth, exact: true }).click();
      // City of Birth
      await page.getByRole('textbox', { name: 'City of Birth' }).fill(data.cityOfBirth);
        // First Language
      const firstLanguageSelect = page.locator('span.select2-selection--single').filter({ has: page.locator('#select2-txtVFirstLanguage-container') });
      await expect(firstLanguageSelect).toBeVisible();
      await firstLanguageSelect.click();
      const options = page.locator(
        '#select2-txtVFirstLanguage-results li.select2-results__option:visible'
      );
      const count = await options.count();
      expect(count).toBeGreaterThan(1);
      await options.filter({ hasText: /.+/ }).nth(1).click();
      // Passport Number
      await page.getByRole('textbox', { name: 'Passport Number' }).fill(data.passportNumber);

      // Do you currently hold Australian Visa?
      // Open "Do you currently hold Australian Visa?" Select2
      const holdVisaSelect = page
      .locator('span.select2-selection--single')
      .filter({ has: page.locator('#select2-txtHoldAusVisa-container') });
        await expect(holdVisaSelect).toBeVisible();
        await holdVisaSelect.scrollIntoViewIfNeeded();
        await holdVisaSelect.click();
    // Select Yes / No
      await page.locator('#select2-txtHoldAusVisa-results li.select2-results__option:visible').filter({ hasText: data.holdAusVisa ? 'Yes' : 'No' }).first().click();
      if (data.holdAusVisa) {
        await page.getByRole('textbox', {
          name: 'When did you first arrive in Australia?'
        }).fill(data.firstArrival);

        await page.locator('#txtVisaType').selectOption(data.visaType);
        if (data.visaType === '2' && data.visaTypeOther) {
          await page.getByRole('textbox', { name: 'txtVisaTypeOther' })
            .fill(data.visaTypeOther);
        }
        await page.getByRole('textbox', { name: 'Visa Number' })
          .fill(data.visaNumber);
        if (data.visaCopyPath) {
          await page.locator('#fileVisaCopy')
            .setInputFiles(data.visaCopyPath);
        }
        if (data.passportCopyPath) {
          await page.locator('#filePassportCopy')
            .setInputFiles(data.passportCopyPath);
        }
      } else {
        if (data.whereVisa) {
          await page.locator('#txtWhereVisa')
            .selectOption(data.whereVisa);
        }
      }
      // OSHC
      if (data.requireOSHC) {
        await page.locator('#select2-txtRequireOSHC-container').click();
        const oshcOptions = {
          '1': 'Yes - Single',
          '2': 'Yes - Couple',
          '3': 'Yes - Family',
          '4': 'No'
        };
        await page.getByRole('option', {
          name: oshcOptions[data.requireOSHC]
        }).click();
        if (data.requireOSHC === '4' && data.validOSHCPath) {
          await page.locator('#fileValidOSHC')
            .setInputFiles(data.validOSHCPath);
        }
      }
      // Airport pickup
      if (data.requireAirport !== undefined) {
        await page.locator('#txtRequireAirport')
          .selectOption(data.requireAirport ? '1' : '0');
      }
      // Homestay
      if (data.requireHomestay !== undefined) {
        await page.locator('#txtRequireHomestay')
          .selectOption(data.requireHomestay ? '1' : '0');
      }
      // Under 18
      if (data.underEighteen !== undefined) {
        await page.locator('#txtUnderEighteen')
          .selectOption(data.underEighteen ? '1' : '0');
      }
      // GTE awareness
      if (data.borderProtection !== undefined) {
        await page.locator('#txtBorderProtection')
          .selectOption(data.borderProtection ? '1' : '0');
      }
      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForTimeout(1000);
  }
  /**
 * Fills English proficiency section
 * Called as: await fillEnglishProficiency(page);
 */
async function fillEnglishProficiency(page) {
  await page.waitForTimeout(config.timeouts.medium);
  const tests = [
    {
      checkboxId: '#txtEnglishProficiencyTest1',
      scoreWrapper: '#score1',
      scoreInput: '#txtScore1',
      value: '7.5' // IELTS
    },
    {
      checkboxId: '#txtEnglishProficiencyTest2',
      scoreWrapper: '#score2',
      scoreInput: '#txtScore2',
      value: '65' // PTE
    },
    {
      checkboxId: '#txtEnglishProficiencyTest3',
      scoreWrapper: '#score3',
      scoreInput: '#txtScore3',
      value: '176' // CAE
    },
    {
      checkboxId: '#txtEnglishProficiencyTest4',
      scoreWrapper: '#score4',
      scoreInput: '#txtScore4',
      value: 'B2' // OTHER
    }
  ];
  for (const test of tests) {
    const checkBox = page.locator(test.checkboxId)
      .locator('xpath=following-sibling::ins');
    await checkBox.scrollIntoViewIfNeeded();
    await checkBox.click({ force: true });

    await page.waitForSelector(
      `${test.scoreWrapper}:not([style*="display:none"])`,
      { timeout: 5000 }
    );
    await page.locator(test.scoreInput).fill(test.value);
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}
//Employment History
async function fillEmploymentHistory(page) {
  const eh = config.employmentHistory;
  await page.waitForTimeout(config.timeouts.medium);
    // Fill the first row (always exists)
  if (eh.length > 0) {
    const firstJob = eh[0];
    await page.locator('input[name="txtEmploymentJobTitle[]"]').first().fill(firstJob.jobTitle);
    await page.locator('input[name="txtEmploymentCompany[]"]').first().fill(firstJob.company);
    await page.locator('input[name="txtEmploymentDuration[]"]').first().fill(firstJob.duration);
    await page.locator('input[name="txtEmploymentContactPerson[]"]').first().fill(firstJob.contactPerson);
  }
    // Add additional rows if needed
  for (let i = 1; i < eh.length; i++) {
    // Click "Add More" button to add a new row
    await page.locator('#addmorejob').click();
    await page.waitForTimeout(config.timeouts.short);
    const job = eh[i];
    // Fill the newly added row
    await page.locator('input[name="txtEmploymentJobTitle[]"]').nth(i).fill(job.jobTitle);
    await page.locator('input[name="txtEmploymentCompany[]"]').nth(i).fill(job.company);
    await page.locator('input[name="txtEmploymentDuration[]"]').nth(i).fill(job.duration);
    await page.locator('input[name="txtEmploymentContactPerson[]"]').nth(i).fill(job.contactPerson);
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}

/**
 * Fills previous studies information in a form
 * @param {Page} page - Playwright page object
 * @param {Object} [studiesData=config.previousStudies] - Previous studies data
 * @returns {Promise<void>}
 */
async function fillPreviousStudies(page, studiesData) {
  // Use provided data or fall back to config
  const data = studiesData || config.previousStudies;
    await page.waitForTimeout(config.timeouts.medium);
    // Have you previously studied in Australia?
  if (data.studiedInAustralia) {
    await page.locator('#txtPreviousStudyInAus').selectOption(data.studiedInAustralia);
    await page.waitForTimeout(config.timeouts.short);
  }
    // Are you transferring from another education provider?
  if (data.transferFromAnother) {
    await page.locator('#txtTransferFromAnother').selectOption(data.transferFromAnother);
    await page.waitForTimeout(config.timeouts.short);
  }
    // Did you complete your course?
  if (data.completeCourse) {
    await page.locator('#txtCompleteCourse').selectOption(data.completeCourse);
    await page.waitForTimeout(config.timeouts.short);
        // If completed course is "Yes", attach transcript
    if (data.completeCourse === '1' && data.transcriptPath) {
      await page.waitForSelector('#divCompleteCourse:not([style*="display:none"])', { timeout: 5000 });
      await page.locator('#fileCompleteCourseTranscript').setInputFiles(data.transcriptPath);
    }
  }
    // Do you have a release letter?
  if (data.releaseLetter) {
    await page.locator('#txtReleaseLetter').selectOption(data.releaseLetter);
    await page.waitForTimeout(config.timeouts.short);
        // If release letter is "Yes", attach release letter
    if (data.releaseLetter === '1' && data.releaseLetterPath) {
      await page.waitForSelector('#divReleaseLetter:not([style*="display:none"])', { timeout: 5000 });
      await page.locator('#fileReleaseLetter').setInputFiles(data.releaseLetterPath);
    }
  }
    // Highest qualification in Australia
  if (data.highestQualificationAus) {
    await page.locator('#txtHighestQualificationAus').fill(data.highestQualificationAus);
  }
    // Highest qualification from Overseas
  if (data.highestQualificationOverseas) {
    await page.locator('#txtHighestQualificationOve').fill(data.highestQualificationOverseas);
  }
    await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}
/**
 * Fills Financial Declaration section
 */
async function fillFinancialDeclaration(page) {
  await page.waitForTimeout(config.timeouts.medium);
  const checkbox = page
    .locator('#txtDesclaimerFinancial')
    .locator('xpath=following-sibling::ins');
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.click({ force: true });
  await page.waitForTimeout(config.timeouts.short);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}
async function selectSelect2(
  page,
  containerId,
  optionText,
  searchText = optionText
) {
  // 🔹 Get the clickable Select2 wrapper
  const selection = page
    .locator(`#${containerId}`)
    .locator('xpath=ancestor::span[contains(@class,"select2-selection")]');
  // Wait until attached (not visibility — it may be hidden)
  await selection.waitFor({ state: 'attached', timeout: 10000 });
  // Bring into view & click
  await selection.scrollIntoViewIfNeeded();
  await selection.click({ force: true });
  // 🔹 Search input inside dropdown
  const searchBox = page.locator(
    '.select2-dropdown .select2-search__field'
  );
  await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  await searchBox.fill(searchText);
  // 🔹 Select option
  const option = page
    .locator('.select2-results__option')
    .filter({ hasText: optionText })
    .first();

  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.click();
}

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
  await page.locator('#txtCurrentlyEnrolled').locator('xpath=following-sibling::span') .click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.locator('//label[contains(.,"Have you previously completed a qualification funded under the JobTrainer Fund?")]/following-sibling::div//label[.//text()[contains(.,"No")]]').click();
  await page.locator('input[name="txtJobSeeker"][value="1"]').locator('xpath=ancestor::label').click();
  await page.locator('input[name="txtJobEvidenceType[]"][value="1"]').locator('xpath=ancestor::label').click();
  await page.setInputFiles('#fileEvidenceTrainerFund',config.documents.concessionCard);
  await page.locator('input[name="txtSchoolLeaver"][value="1"]').locator('xpath=ancestor::label').click();
  await page.selectOption('#txtReason', {label: 'To get a job (01)'});
  await page.getByRole('button', { name: 'Next' }).click();
}


async function rpl(page) {
   //RPL Information
   await page.waitForTimeout(config.timeouts.long);
   await page.getByRole('insertion').first().click();
   await page.getByRole('insertion').nth(3).click();
   await page.getByRole('button', { name: 'Next' }).click();
   await page.waitForTimeout(config.timeouts.short);
}

async function fillStudentIdentifiers(page) {
  const i = config.identifiers;
  await page.getByRole('textbox', { name: 'Unique Student Identifier' }).click();
  await page.getByRole('textbox', { name: 'Unique Student Identifier' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'Learner Unique Identifier' }).click();
  await page.getByRole('textbox', { name: 'Learner Unique Identifier' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'WorkReady Participant Number' }).click();
  await page.getByRole('textbox', { name: 'WorkReady Participant Number' }).fill('111111111');
  await page.getByRole('textbox', { name: 'SACE Student ID' }).click();
  await page.getByRole('textbox', { name: 'SACE Student ID' }).fill('1111111');
  await page.getByRole('textbox', { name: 'SafeworkSA ID' }).click();
  await page.getByRole('textbox', { name: 'SafeworkSA ID' }).fill('11111111111111');
  await page.getByRole('textbox', { name: 'Victorian Student Number' }).click();
  await page.getByRole('textbox', { name: 'Victorian Student Number' }).fill('1111111');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
 }
async function uploadDocuments(page) {
  const d = config.documents;
  await page.waitForTimeout(config.timeouts.short);
  await page.getByLabel('Australian Drivers Licence Front').setInputFiles(d.driversFront);
  await page.getByLabel('Australian Drivers Licence Back').setInputFiles(d.driversBack);
  await page.getByLabel('Concession Cards (Health card').setInputFiles(d.concessionCard);
  await page.getByLabel('Medicare Card').setInputFiles(d.medicare);
  await page.getByLabel('Your Photo').setInputFiles(d.photo);
  await page.getByLabel('Any other document').setInputFiles(d.other);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
 }
async function fillAgentRepresentative(page) {
  const agentData = config.agentRepresentative; // 👈 default source
  await page.waitForTimeout(config.timeouts.medium);
  // Agency details
  if (agentData.agencyName) {
    await page.locator('#txtAgencyName').fill(agentData.agencyName);
  }
  if (agentData.agencyEmail) {
    await page.locator('#txtAgencyEmail').fill(agentData.agencyEmail);
  }
  if (agentData.agencyAddress) {
    await page.locator('#txtAgencyAddress').fill(agentData.agencyAddress);
  }
  if (agentData.contactPerson) {
    await page.locator('#txtAgencyContactPerson').fill(agentData.contactPerson);
  }
  if (agentData.contactNumber) {
    await page.locator('#txtAgencyContactNumber').fill(agentData.contactNumber);
  }
  // Signature (if required)
  if (agentData.requiresSignature) {
    const signaturePad = page.locator('#agent-signature-pad');
    await signaturePad.scrollIntoViewIfNeeded();
    await signaturePad.click({
      position: { x: 200, y: 100 }
    });
    await page.waitForTimeout(config.timeouts.short);
  }

  // Next
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}
async function drawSignature(page, canvasSelector = '#signature-pad') {
  const canvas = page.locator(canvasSelector);
  await canvas.scrollIntoViewIfNeeded();

  const box = await canvas.boundingBox();
  if (!box) throw new Error('Signature canvas not visible');

  const startX = box.x + box.width / 4;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  await page.mouse.move(startX + 50, startY + 10);
  await page.mouse.move(startX + 100, startY - 10);

  await page.mouse.up();
}
function getTodayDDMMYYYY() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

async function fillDeclarationAndSignature(page) {
  await drawSignature(page);
  await page.waitForTimeout(config.timeouts.short);
  await page.locator('#txtDeclarationName').fill('Test Student');
  await page.locator('#txtDateOfSign').fill(getTodayDDMMYYYY());
  await page.waitForTimeout(config.timeouts.short);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
}
async function completePayment_paid(page) {
  const pay = config.payment;
  await page.getByText('Paid / Free').click();
  await page.locator('label').filter({ hasText: 'In person' }).getByRole('insertion').click();
  await page.getByRole('textbox', { name: 'Payment date *' }).click();
  await page.getByRole('link', { name: String(new Date().getDate()), exact: true }).click();
  await page.locator('#btnSave').click({ noWaitAfter: true });
}
async function completePayment_unpaid(page) {
  await page.locator('label').filter({ hasText: 'Pay Later' }).getByRole('insertion').click();
  await page.locator('#btnSave').click({ noWaitAfter: true });
}

module.exports = {
  fillPersonalDetails1,
  fillPersonalDetails2,
  fillPersonalDetails3,
  fillPersonalDetails4,
  fillPersonalDetails5,
  fillResidentialDetails,
  fillContactInformation,
  fillEmployerDetails,
  fillVisaAndArrivalInfo,
  fillPreCourseEvaluation,
  rpl,
  fillEnglishProficiency,
  fillPreviousStudies,
  fillEmploymentHistory,
  fillFinancialDeclaration,
  fillStudentIdentifiers,
  uploadDocuments,
  fillAgentRepresentative,
  fillDeclarationAndSignature,
  completePayment_paid,
  completePayment_unpaid
};
