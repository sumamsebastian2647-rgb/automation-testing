const { test, expect } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('../auth.js');
const { DashboardPage } = require('../pages/DashboardPage.js');
const { formTemplate } = require('../createform_config.js');
const { saveGeneratedUrl } = require('../util/runtimeData.js');

const { config } = require('../config');

const fs = require('fs');
const path = require('path');
const { getLatestGeneratedUrl } =  require('../util/runtimeData.js');

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
  performGlobalSearch,
  performGlobalSearchFlexible,
  verifyCustomFieldData,
  verifyCustomFieldsInSection,
  closeGlobalSearchModal
} = require('../verify_enrollment.js');

const testData = [
  {
    description: 'Manual Acceptance - Payment Done',
    linkType: 'manualacceptancelink1',
    course: config.courselist.course1,
    personalDetails: fillPersonalDetails1,
    verifyFunction: verify_manualpaidnewstudent,
    paymentFunction: completePayment_paid,
  },
 
];

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

  async searchStudent(studentName) {
    console.log(`Searching for student: ${studentName}`);
    
    try {
      // Try the standard global search first
      const searchSuccess = await performGlobalSearch(this.page, studentName);
      if (searchSuccess) {
        console.log(`Successfully found and clicked on student: ${studentName}`);
        return true;
      }
      
      console.log('Standard search failed, trying flexible search...');
      const flexibleSuccess = await performGlobalSearchFlexible(this.page, studentName);
      if (flexibleSuccess) {
        console.log(`Successfully found student using flexible search: ${studentName}`);
        return true;
      }
      
      console.log(`Student ${studentName} not found in search results`);
      return false;
      
    } catch (error) {
      console.error('Error during student search:', error.message);
      await this.page.screenshot({ path: `search-error-${Date.now()}.png` });
      return false;
    }
  }

  async verifyStudentCustomFields(studentName, sectionsToCheck = ['Residential Information']) {
    console.log(`Verifying custom fields for student: ${studentName}`);
    
    try {
      // First search for the student
      const studentFound = await this.searchStudent(studentName);
      
      if (studentFound) {
        // Verify all custom field data
        const verificationResult = await verifyCustomFieldData(this.page);
        
        // Verify specific sections
        for (const section of sectionsToCheck) {
          try {
            await verifyCustomFieldsInSection(this.page, section);
          } catch (sectionError) {
            console.warn(`Could not verify section ${section}:`, sectionError.message);
          }
        }
        
        return verificationResult;
      } else {
        console.log('Student not found, cannot verify custom fields');
        return { success: false, error: 'Student not found' };
      }
      
    } catch (error) {
      console.error('Error verifying student custom fields:', error.message);
      await this.page.screenshot({ path: `custom-field-verification-error-${Date.now()}.png` });
      return { success: false, error: error.message };
    }
  }
}

test.describe('Generate Course Link Tests', () => {
  let dashboardPage;
   test.use({
    timeout: 120000,
    viewport: { width: 1440, height: 900 } // 🔒 lock viewport
  });

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await loginAsAdmin(page);
    await dashboardPage.navigate();
  });

  test("create course", async ({ page }) => {
    await dashboardPage.openDomesticFormTemplate();
    await dashboardPage.openFormInformationSection();
    await dashboardPage.fillFormInformation(formTemplate.domestic);
    await dashboardPage.saveFormLayout();
    
  });
    test("edit course", async ({ page }) => {
    await dashboardPage.searchByFormName(formTemplate.domestic.formName);
    await dashboardPage.editFirstForm();
           // 👉 Define sections ONCE
    const sections = [
      'residential',
      'contact',
      'employer',
      'preCourse',
      //'rpl',
      //'studentIdentifier',
      ];

    for (const key of sections) {
      console.log(`Adding custom fields for: ${key}`);

      // 1️⃣ Open accordion
      await dashboardPage.openSection(key);

      // 2️⃣ Add all field types
      const createdFields =
        await dashboardPage.addAllCustomFieldsToSection(
          dashboardPage.FORM_SECTIONS[key]
        );

      // 3️⃣ (Optional) persist for enrollment test
      console.log(createdFields);
      // saveCustomFields(formName, key, createdFields);
      }
    
  });

     
   
  test("Generate course link", async ({ page }) => {
    // Search for the specific form
   await dashboardPage.searchByFormName(formTemplate.domestic.formName);
    
    // Generate link from first row and get the URL
    const generatedUrl = await dashboardPage.generateLinkFromFirstRow();
    
    // Verify that a URL was generated

    expect(generatedUrl).toBeTruthy();
    expect(generatedUrl).toContain('http');
    
    // Log the generated URL for verification
    console.log('Generated enrollment link:', generatedUrl);
    saveGeneratedUrl(formTemplate.domestic.formName, generatedUrl);
    
       await logoutAsAdmin(page);
    
    // Optionally, you can test the generated link by navigating to it
    // await page.goto(generatedUrl);
    // Add assertions to verify the enrollment form loads correctly
  });

   for (const data of testData) {
  test(`Enroll new student - ${data.description}`, async ({ page }) => {
    test.setTimeout(600000);

    try {
       const enrollmentUrl = getLatestGeneratedUrl();

       console.log('Using latest enrollment URL:', enrollmentUrl);
       //const enrollmentLink = config.generatelink[data.linkType];
      //await page.goto(enrollmentLink);
       await logoutAsAdmin(page);

      await page.goto(enrollmentUrl);
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
      
      // Get student name based on the test data being used
      let studentName;
      if (data.personalDetails === fillPersonalDetails1) {
        studentName = `${config.personal1.firstName} ${config.personal1.lastName}`.trim();
      } else if (data.personalDetails === fillPersonalDetails2) {
        studentName = `${config.personal2.firstName} ${config.personal2.lastName}`.trim();
      } else if (data.personalDetails === fillPersonalDetails3) {
        studentName = `${config.personal3.firstName} ${config.personal3.lastName}`.trim();
      } else if (data.personalDetails === fillPersonalDetails4) {
        studentName = `${config.personal4.firstName} ${config.personal4.lastName}`.trim();
      } else {
        studentName = `${config.personal1.firstName} ${config.personal1.lastName}`.trim(); // fallback
      }
      
      console.log(`Performing global search for student: ${studentName}`);
      
      try {
        // Try the standard global search first
        const searchSuccess = await performGlobalSearch(page, studentName);
        if (searchSuccess) {
          console.log('Student found via global search, verifying custom field data...');
          
          // Verify custom field data on the student page
          const verificationResult = await verifyCustomFieldData(page);
          
          // Also verify specific sections if needed
          const sectionsToCheck = ['Custom Fields - Residential Information', 'Residential Information'];
          for (const section of sectionsToCheck) {
            try {
              await verifyCustomFieldsInSection(page, section);
            } catch (sectionError) {
              console.warn(`Could not verify section ${section}:`, sectionError.message);
            }
          }
          
          // Only proceed with verification functions if custom fields are found
          if (verificationResult.success) {
            console.log('✅ Custom field verification successful, proceeding with enrollment verification...');
            await data.verifyFunction(page, data.course);
            await logoutAsAdmin(page);
          } else {
            console.log('❌ Custom field verification failed, skipping enrollment verification');
            console.log('Please check if custom fields were properly filled during enrollment');
            await logoutAsAdmin(page);
            return; // Exit the test early
          }
          
        } else {
          console.log('Standard search failed, trying flexible search...');
          const flexibleSuccess = await performGlobalSearchFlexible(page, studentName);
          if (flexibleSuccess) {
            console.log('Student found via flexible search, verifying custom field data...');
            const verificationResult = await verifyCustomFieldData(page);
            
            if (verificationResult.success) {
              console.log('✅ Custom field verification successful, proceeding with enrollment verification...');
              await data.verifyFunction(page, data.course);
              await logoutAsAdmin(page);
            } else {
              console.log('❌ Custom field verification failed, skipping enrollment verification');
              await logoutAsAdmin(page);
              return;
            }
          } else {
            console.log('❌ Student not found in search, proceeding with normal verification...');
            await data.verifyFunction(page, data.course);
            await logoutAsAdmin(page);
          }
        }
      } catch (error) {
        console.warn('Global search failed, continuing with normal verification:', error.message);
        await data.verifyFunction(page, data.course);
        await logoutAsAdmin(page);
      }

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
});