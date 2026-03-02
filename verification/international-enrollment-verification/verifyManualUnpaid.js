/**
 * Manual Unpaid Student Verification Module
 * @module verification/verifyManualUnpaid
 * 
 * Import from: require('../verification/verifyManualUnpaid')
 * 
 * @example
 * const { verify_manualunpaidnewstudent } = require('../verification/verifyManualUnpaid');
 * await verify_manualunpaidnewstudent(page, courseName);
 */

const { config } = require('../../config/config.js');
const {
  retry,
  getPageElements,
  confirmEnrollment,
  markAsPaid,
  verifyInActiveStudents
} = require('./utils');

/**
 * Verification workflow for manual unpaid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function manualUnpaidWorkflow(page, elements, studentName) {
  try {
    // Step 1: Confirming enrollment
    console.log('Step 1: Confirming enrollment');
    await elements.pendingEnrolmentLink.click();
    await page.waitForLoadState('networkidle');
    await elements.newStudentsLinkPending.click();
    await page.waitForSelector('table tbody tr', { timeout: 20000 });
    await confirmEnrollment(page, elements, studentName);
    await page.waitForLoadState('networkidle');
    
    // Step 2: Handle Unpaid Status
    console.log('Step 2: Marking as paid');
    await elements.unpaidStudentsLink.click();
    await page.waitForLoadState('networkidle');
    await elements.newStudentsLinkUnpaid.click();
    await page.waitForSelector('table tbody tr', { timeout: 20000 });
    await markAsPaid(page, elements, studentName);
    await page.waitForLoadState('networkidle');
    console.log('....... Successfully completed manual unpaid student verification.......');
  } catch (error) {
    console.error('Error in manual unpaid verification:', error);
    throw error;
  }
}

/**
 * Base verification function for manual unpaid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} studentName - Student name
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verifyManualUnpaidStudent(page, studentName, course) {
  console.log(`Verifying manual unpaid student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);
  try {
    await retry(() => elements.studentManagementLink.click());
    await manualUnpaidWorkflow(page, elements, studentName);
    await verifyInActiveStudents(page, elements, studentName, course);
  } catch (error) {
    console.error('Error in manual unpaid student verification:', {
      message: error.message,
      studentName,
      course
    });
    throw error;
  }
}

/**
 * Verify manual unpaid new student (uses config.personal2)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verify_manualunpaidnewstudent(page, course) {
  const personal2 = config.personal2;
  const fullName = `${personal2.firstName} ${personal2.lastName}`.trim();
  console.log('Checking manual unpaid new student');
  await verifyManualUnpaidStudent(page, fullName, course);
}

module.exports = {
  verify_manualunpaidnewstudent
};
