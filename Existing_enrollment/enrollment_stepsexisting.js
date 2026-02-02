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
   await page.getByRole('button', { name: 'Next' }).click();
}
async function fillContactInformation(page) {
  const c = config.contact;
   await page.getByRole('button', { name: 'Next' }).click();
}
async function fillEmployerDetails(page) {
  const e = config.employer;
   await page.getByRole('button', { name: 'Next' }).click();
}
async function fillPreCourseEvaluation(page) {
  const p = config.preCourseEval;
    await page.getByRole('button', { name: 'Next' }).click();
}
async function rpl(page) {
   //RPL Information
   
    await page.getByRole('button', { name: 'Next' }).click();
   await page.waitForTimeout(config.timeouts.short);
  
}
async function fillStudentIdentifiers(page) {
  const i = config.identifiers;
   await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
 }
async function uploadDocuments(page) {
  const d = config.documents;
   await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000)
 }
async function fillDeclarationAndSignature(page) {
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
  fillPreCourseEvaluation,
  rpl,
  fillStudentIdentifiers,
  uploadDocuments,
  fillDeclarationAndSignature,
  completePayment_paid,
  completePayment_unpaid
};
