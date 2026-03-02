/**
 * Manual Paid Student Verification Module
 * @module verification/verifyManualPaid
 * 
 * Import from: require('../verification/verifyManualPaid')
 * 
 * @example
 * const { verify_manualpaidnewstudent } = require('../verification/verifyManualPaid');
 * await verify_manualpaidnewstudent(page, courseName);
 */

const { config } = require('../../config/config.js');
const {
  retry,
  getPageElements,
  confirmEnrollment,
  verifyInActiveStudents
} = require('./utils');

/**
 * Verification workflow for manual paid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function manualPaidWorkflow(page, elements, studentName) {
  await elements.pendingEnrolmentLink.click();
  await elements.newStudentsLink.click();
  await confirmEnrollment(page, elements, studentName);
}

/**
 * Base verification function for manual paid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} studentName - Student name
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verifyManualPaidStudent(page, studentName, course) {
  console.log(`Verifying manual paid student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);
  try {
    await retry(() => elements.studentManagementLink.click());
    await manualPaidWorkflow(page, elements, studentName);
    await verifyInActiveStudents(page, elements, studentName, course);
  } catch (error) {
    console.error('Error in manual paid student verification:', {
      message: error.message,
      studentName,
      course
    });
    throw error;
  }
}

/**
 * Verify manual paid new student (uses config.personal1)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verify_manualpaidnewstudent(page, course) {
  const personal1 = config.personal1;
  const fullName = `${personal1.firstName} ${personal1.lastName}`.trim();
  console.log('Checking manual paid new student');
  await verifyManualPaidStudent(page, fullName, course);
}

/**
 * Verify manual paid new student temporary (uses config.personal5)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verify_manualpaidnewstudent_temporary(page, course) {
  const personal5 = config.personal5;
  const fullName = `${personal5.firstName} ${personal5.lastName}`.trim();
  console.log('Checking manual paid new student (temporary)');
  await verifyManualPaidStudent(page, fullName, course);
}

module.exports = {
  verify_manualpaidnewstudent,
  verify_manualpaidnewstudent_temporary
};
