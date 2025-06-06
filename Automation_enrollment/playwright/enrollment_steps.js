// enrollmentSteps.js
const { config } = require('./config');

async function fillPersonalDetails1(page) {
  const personal = config.personal1; 
  await page.getByLabel('Title *').waitFor({ state: 'visible' });
  await page.getByLabel('Title *').selectOption(personal.title);
  await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personal.firstName);
  await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personal.lastName);
  await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personal.dob);
  await page.getByText(personal.gender).click();
  await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personal.phone);
  await page.getByRole('textbox', { name: 'Email *' }).fill(personal.email);
  await page.getByRole('textbox', { name: 'Username *' }).fill(personal.username);
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillPersonalDetails2(page) {
  const personal = config.personal2; 
  await page.getByLabel('Title *').waitFor({ state: 'visible' });
  await page.getByLabel('Title *').selectOption(personal.title);
  await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personal.firstName);
  await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personal.lastName);
  await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personal.dob);
  await page.getByText(personal.gender).click();
  await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personal.phone);
  await page.getByRole('textbox', { name: 'Email *' }).fill(personal.email);
  await page.getByRole('textbox', { name: 'Username *' }).fill(personal.username);
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillPersonalDetails3(page) {
  const personal = config.personal3; 
  await page.getByLabel('Title *').waitFor({ state: 'visible' });
  await page.getByLabel('Title *').selectOption(personal.title);
  await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personal.firstName);
  await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personal.lastName);
  await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personal.dob);
  await page.getByText(personal.gender).click();
  await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personal.phone);
  await page.getByRole('textbox', { name: 'Email *' }).fill(personal.email);
  await page.getByRole('textbox', { name: 'Username *' }).fill(personal.username);
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillPersonalDetails4(page) {
  const personal = config.personal4; 
  await page.getByLabel('Title *').waitFor({ state: 'visible' });
  await page.getByLabel('Title *').selectOption(personal.title);
  await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personal.firstName);
  await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personal.lastName);
  await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personal.dob);
  await page.getByText(personal.gender).click();
  await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personal.phone);
  await page.getByRole('textbox', { name: 'Email *' }).fill(personal.email);
  await page.getByRole('textbox', { name: 'Username *' }).fill(personal.username);
  await page.getByRole('button', { name: 'Next' }).click();
}
async function fillPersonalDetails5(page) {
  const personal = config.personal5; 
  await page.getByLabel('Title *').waitFor({ state: 'visible' });
  await page.getByLabel('Title *').selectOption(personal.title);
  await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personal.firstName);
  await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personal.lastName);
  await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personal.dob);
  await page.getByText(personal.gender).click();
  await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personal.phone);
  await page.getByRole('textbox', { name: 'Email *' }).fill(personal.email);
  await page.getByRole('textbox', { name: 'Username *' }).fill(personal.username);
  await page.getByRole('button', { name: 'Next' }).click();
}
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
async function fillPreCourseEvaluation(page) {
  const p = config.preCourseEval;
  await page.locator('#Step5 > div > div > .select2 > .selection > .select2-selection > .select2-selection__arrow > b').first().click();
  await page.getByRole('option', { name: 'Australia', exact: true }).click();
  await page.getByRole('textbox', { name: 'City of Birth' }).click();
  await page.getByRole('textbox', { name: 'City of Birth' }).fill('sydney');
  await page.locator('div:nth-child(3) > div > .select2 > .selection > .select2-selection > .select2-selection__arrow > b').first().click();
  await page.getByRole('option', { name: 'Australia', exact: true }).click();
  await page.locator('div:nth-child(3) > div:nth-child(2) > .select2 > .selection > .select2-selection > .select2-selection__arrow > b').click();
  await page.getByRole('option', { name: 'Australian Citizen' }).click();
  await page.locator('.block > .iradio_flat-red > .iCheck-helper').first().click();
  await page.getByLabel('Employment Status', { exact: true }).selectOption('01');
  await page.locator('#Step5 > div:nth-child(5) > div > .select2 > .selection > .select2-selection > .select2-selection__arrow').first().click();
  await page.getByRole('option', { name: 'Aboriginal and Torres Strait Islander Education Worker (422111)' }).click();
  await page.locator('#Step5 > div:nth-child(5) > div:nth-child(2) > .select2 > .selection > .select2-selection > .select2-selection__arrow > b').click();
  await page.getByRole('option', { name: 'Accommodation (44)' }).click();
  await page.getByLabel('', { exact: true }).locator('b').click();
  await page.getByRole('option', { name: 'AUSTRALIAN INDIGENOUS LANGUAGES', exact: true }).click();
  await page.getByLabel('Proficiency in English?').selectOption('1');
  await page.getByLabel('English Support?').selectOption('Y');
  await page.getByLabel('Attending school?').selectOption('1');
  await page.getByRole('textbox', { name: 'School Name *' }).click();
  await page.getByRole('textbox', { name: 'School Name *' }).fill('test');
  await page.getByLabel('Highest Completed School Level').selectOption('12');
  await page.getByRole('spinbutton', { name: 'Completion year' }).click();
  await page.getByRole('spinbutton', { name: 'Completion year' }).fill('2000');
  await page.getByText('Attending school? Yes No School Name * Highest Completed School Level Completed').click();
  await page.locator('#Step5').getByText('Not Specified', { exact: true }).nth(2).click();
  await page.locator('.txtPriorEducationFlag > .iradio_flat-red > .iCheck-helper').first().click();
  await page.getByRole('listitem').filter({ hasText: /^$/ }).click();
  //await page.getByRole('searchbox', { name: 'Are you currently enroled in' }).fill('');
  //await page.getByRole('option', { name: 'Bachelor Degree or Higher' }).click();
  await page.locator('div:nth-child(12) > .col-md-12 > div > label > .iradio_flat-red > .iCheck-helper').first().click();
  await page.locator('div:nth-child(13) > .col-md-12 > div > label > .iradio_flat-red > .iCheck-helper').first().click();
  await page.locator('div:nth-child(15) > .col-md-12 > div > label > .iradio_flat-red > .iCheck-helper').first().click();
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
async function fillDeclarationAndSignature(page) {
  await page.locator('#signature-pad').click({
    position: {
      x: 97,
      y: 109
    }
  });
  await page.waitForTimeout(config.timeouts.short);
  await page.getByRole('textbox', { name: 'Name *' }).click();
  await page.getByRole('textbox', { name: 'Name *' }).fill('Test Automation');
  await page.getByRole('textbox', { name: 'Date *' }).click();
  await page.getByRole('link', { name: String(new Date().getDate()), exact: true }).click();
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
  await page.getByRole('button', { name: 'Submit' }).click();
}
async function completePayment_unpaid(page) {
  await page.locator('label').filter({ hasText: 'Pay Later' }).getByRole('insertion').click();
  await page.getByRole('button', { name: 'Submit' }).click();
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
  fillPreCourseEvaluation,
  rpl,
  fillStudentIdentifiers,
  uploadDocuments,
  fillDeclarationAndSignature,
  completePayment_paid,
  completePayment_unpaid
};
