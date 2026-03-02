const { test, expect } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('./auth.js');
const { fetchOtpWithRetry } = require('./fetchOtpFromMailinator');
const { config } = require('../config/config.js');
const fs = require('fs');
const path = require('path');

const {
  fillResidentialDetails,
  fillContactInformation,
  fillEmployerDetails,
  fillPreCourseEvaluation,
  rpl,
  fillStudentIdentifiers,
  uploadDocuments,
  fillDeclarationAndSignature,
  completePayment_paid,
  completePayment_unpaid,
} = require('./enrollment_stepsexisting.js');

const {
  verify_manualpaidexistingstudent,
  verify_manualunpaidexistingstudent,
  verify_autopaidexistingstudent,
  verify_autounpaidexistingstudent,
} = require('./verify_enrollment.js');

// Load generated data
const generatedDataPath = path.resolve(__dirname, './test-data/generatedData.json');
const generatedData = JSON.parse(fs.readFileSync(generatedDataPath, 'utf-8'));

// Create personal details fillers from JSON data
function generatePersonalFillerFromJSON(personalData) {
  return async function (page) {
    await page.getByRole('textbox', { name: 'First Name/Given Names *' }).waitFor({ timeout: 10000 });
    await page.getByRole('combobox', { name: 'Title *' }).selectOption(personalData.title);
    await page.getByRole('textbox', { name: 'First Name/Given Names *' }).fill(personalData.firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill('');
    await page.getByRole('textbox', { name: 'Surname/Last Name *' }).fill(personalData.lastName);
    await page.getByRole('textbox', { name: 'Date of Birth *' }).fill(personalData.dob);
    await page.getByText(personalData.gender).click();
    await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill(personalData.phone);
    await page.getByRole('textbox', { name: /^Email\b/i }).fill(personalData.email);
    await page.getByRole('textbox', { name: /^Confirm Email\b/i }).fill(personalData.email);
    await page.getByRole('textbox', { name: 'Username *' }).fill(personalData.username);
    await page.getByLabel(personalData.gender).check();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.setInputFiles('#fileStudentPhotoUpload', config.documents.photo);
  };
}

// Create personal details functions from JSON data
const fillPersonalDetailsFromJSON = generatedData.map(data => generatePersonalFillerFromJSON(data));

// Test data using existing student links and courses
const testData = [
  {
    description: 'Manual Acceptance - Payment Done',
    linkType: 'manualacceptancelink1_existing',
    course: config.courselistexisting.course1_existing,
    personalDetails: fillPersonalDetailsFromJSON[0],
    verifyFunction: verify_manualpaidexistingstudent,
    paymentFunction: completePayment_paid,
    email: generatedData[0].email,
  },
  {
    description: 'Manual Acceptance - Payment Not Done',
    linkType: 'manualacceptancelink2_existing',
    course: config.courselistexisting.course2_existing,
    personalDetails: fillPersonalDetailsFromJSON[1],
    verifyFunction: verify_manualunpaidexistingstudent,
    paymentFunction: completePayment_unpaid,
    email: generatedData[1].email,
  },
  {
    description: 'Auto Acceptance - Payment Done',
    linkType: 'autoacceptancelink1_existing',
    course: config.courselistexisting.course3_existing,
    personalDetails: fillPersonalDetailsFromJSON[2],
    verifyFunction: verify_autopaidexistingstudent,
    paymentFunction: completePayment_paid,
    email: generatedData[2].email,
  },
  {
    description: 'Auto Acceptance - Payment Not Done',
    linkType: 'autoacceptancelink2_existing',
    course: config.courselistexisting.course4_existing,
    personalDetails: fillPersonalDetailsFromJSON[3],
    verifyFunction: verify_autounpaidexistingstudent,
    paymentFunction: completePayment_unpaid,
    email: generatedData[3].email,
  },
];

// Enrollment checker class (same as new enrollment)
class EnrollmentChecker {
  constructor(page) {
    this.page = page;
  }

  async checkAlreadyEnrolled() {
    try {
      await this.page.waitForTimeout(2000);

      const enrollmentPopup = this.page.locator(
        '.swal2-popup.swal2-modal.swal2-show:has(.swal2-icon.swal2-error)'
      );

      const isVisible = await enrollmentPopup.isVisible().catch(() => false);

      if (isVisible) {
        const hasMessage = await this.page
          .locator('#swal2-content')
          .filter({ hasText: 'You have already enrolled in this course.' })
          .isVisible()
          .catch(() => false);

        if (hasMessage) {
          console.log('Execution stopped: You have already enrolled in this course');
          process.exit(0);
        }
      }
    } catch (error) {
      return false;
    }
  }
}

// OTP verification function
async function handleOTPVerification(page, email) {
  await page.getByRole('textbox', { name: 'Enter the 6-digit' }).click();
  const otp = await fetchOtpWithRetry(email, 3, 10000);
  expect(otp).not.toBeNull();
  console.log(`✅ OTP received: ${otp}`);
  await page.getByRole('textbox', { name: 'Enter the 6-digit' }).fill(otp);
  await page.getByRole('button', { name: ' Verify & Continue' }).click();
  await page.click('.swal2-confirm.swal2-styled');
}

// Main tests for existing students
for (const data of testData) {
  test(`Enroll existing student - ${data.description}`, async ({ page }) => {
    test.setTimeout(600000);

    try {
      const enrollmentLink = config.generatelinkexisting[data.linkType];
      await page.goto(enrollmentLink);

      await data.personalDetails(page);

      const enrollmentChecker = new EnrollmentChecker(page);
      await enrollmentChecker.checkAlreadyEnrolled();

      // Handle OTP verification
      await handleOTPVerification(page, data.email);

      await fillResidentialDetails(page);
      await fillContactInformation(page);
      await fillEmployerDetails(page);
      await fillPreCourseEvaluation(page);
      await rpl(page);
      await fillStudentIdentifiers(page);
      await uploadDocuments(page);
      await fillDeclarationAndSignature(page);
      await data.paymentFunction(page);
      await page.waitForTimeout(1000);

      await loginAsAdmin(page);
      await data.verifyFunction(page, data.course);
      await logoutAsAdmin(page);

    } catch (error) {
      console.error(`Test error - ${data.description}:`, error);
      await page.screenshot({
        path: `error-existing-${Date.now()}.png`,
        fullPage: true,
      });
      throw error;
    }
  });
}

module.exports = { EnrollmentChecker };