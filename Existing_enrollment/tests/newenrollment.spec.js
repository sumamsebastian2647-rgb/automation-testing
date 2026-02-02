const { test, expect } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('../auth.js');
const { config } = require('../config');
const fs = require('fs');
const path = require('path');

const {
  fillPersonalDetails1,
  fillPersonalDetails2,
  fillPersonalDetails3,
  fillPersonalDetails4,
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
} = require('../enrollment_steps.js');

const {
  verify_manualpaidnewstudent,
  verify_manualunpaidnewstudent,
  verify_autopaidnewstudent,
  verify_autounpaidnewstudent,
} = require('../verify_enrollment.js');

const testData = [
  {
    description: 'Manual Acceptance - Payment Done',
    linkType: 'manualacceptancelink1',
    course: config.courselist.course1,
    personalDetails: fillPersonalDetails1,
    verifyFunction: verify_manualpaidnewstudent,
    paymentFunction: completePayment_paid,
    personalKey: 'personal1',
  },
  {
    description: 'Manual Acceptance - Payment Not Done',
    linkType: 'manualacceptancelink2',
    course: config.courselist.course2,
    personalDetails: fillPersonalDetails2,
    verifyFunction: verify_manualunpaidnewstudent,
    paymentFunction: completePayment_unpaid,
    personalKey: 'personal2',
  },
  {
    description: 'Auto Acceptance - Payment Done',
    linkType: 'autoacceptancelink1',
    course: config.courselist.course3,
    personalDetails: fillPersonalDetails3,
    verifyFunction: verify_autopaidnewstudent,
    paymentFunction: completePayment_paid,
    personalKey: 'personal3',
  },
  {
    description: 'Auto Acceptance - Payment Not Done',
    linkType: 'autoacceptancelink2',
    course: config.courselist.course4,
    personalDetails: fillPersonalDetails4,
    verifyFunction: verify_autounpaidnewstudent,
    paymentFunction: completePayment_unpaid,
    personalKey: 'personal4',
  },
];

// Function to save generated data to JSON file
function saveGeneratedData() {
  const generatedDataPath = path.resolve(__dirname, '../test-data/generatedData.json');
  
  // Create the directory if it doesn't exist
  const dir = path.dirname(generatedDataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Extract personal data from config
  const generatedData = [
    config.personal1,
    config.personal2,
    config.personal3,
    config.personal4
  ];

  // Write to JSON file
  fs.writeFileSync(generatedDataPath, JSON.stringify(generatedData, null, 2));
  console.log('✅ Generated data saved to test-data/generatedData.json');
}

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

for (const data of testData) {
  test(`Enroll new student - ${data.description}`, async ({ page }) => {
    test.setTimeout(600000);

    try {
      const enrollmentLink = config.generatelink[data.linkType];
      await page.goto(enrollmentLink);

      await data.personalDetails(page); // dynamically injected personal details

      const enrollmentChecker = new EnrollmentChecker(page);
      await enrollmentChecker.checkAlreadyEnrolled();

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

      //await page.reload();
      await loginAsAdmin(page);
      await data.verifyFunction(page, data.course);
      await logoutAsAdmin(page);

      // Save generated data after successful enrollment
      console.log(`✅ Successfully enrolled student for: ${data.description}`);

    } catch (error) {
      console.error(`Test error - ${data.description}:`, error);
      await page.screenshot({
        path: `error-${Date.now()}.png`,
        fullPage: true,
      });
      throw error;
    }
  });
}

// Save generated data after all tests complete
test.afterAll(async () => {
  saveGeneratedData();
});

module.exports = { EnrollmentChecker };
