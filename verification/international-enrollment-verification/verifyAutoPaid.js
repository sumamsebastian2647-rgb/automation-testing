/**
 * Auto Paid Student Verification Module
 * @module verification/verifyAutoPaid
 * 
 * Import from: require('../verification/verifyAutoPaid')
 * 
 * @example
 * const { verify_autopaidnewstudent } = require('../verification/verifyAutoPaid');
 * await verify_autopaidnewstudent(page, courseName);
 */

const { config } = require('../../config/config.js');
const {
  retry,
  getPageElements,
  verifyInActiveStudents
} = require('./utils');

/**
 * Verification workflow for auto paid students
 * Auto-paid students are automatically enrolled and paid, so we skip to active verification
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function autoPaidWorkflow(page, elements, studentName) {
  console.log('Auto-paid student verification - direct active check');
  // Auto-paid students skip manual enrollment and payment steps
}

/**
 * Base verification function for auto paid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} studentName - Student name
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verifyAutoPaidStudent(page, studentName, course) {
  console.log(`Verifying auto paid student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);
  try {
    await retry(() => elements.studentManagementLink.click());
    await autoPaidWorkflow(page, elements, studentName);
    await verifyInActiveStudents(page, elements, studentName, course);
  } catch (error) {
    console.error('Error in auto paid student verification:', {
      message: error.message,
      studentName,
      course
    });
    throw error;
  }
}

/**
 * Verify auto paid new student (uses config.personal3)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verify_autopaidnewstudent(page, course) {
  const personal3 = config.personal3;
  const fullName = `${personal3.firstName} ${personal3.lastName}`.trim();
  console.log('Checking auto-paid new student');
  await verifyAutoPaidStudent(page, fullName, course);
}

module.exports = {
  verify_autopaidnewstudent
};
