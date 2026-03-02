/**
 * Auto Unpaid Student Verification Module
 * @module verification/verifyAutoUnpaid
 * 
 * Import from: require('../verification/verifyAutoUnpaid')
 * 
 * @example
 * const { verify_autounpaidnewstudent } = require('../verification/verifyAutoUnpaid');
 * await verify_autounpaidnewstudent(page, courseName);
 */

const { config } = require('../../config/config.js');
const {
  retry,
  getPageElements,
  markAsPaid,
  verifyInActiveStudents
} = require('./utils');

/**
 * Verification workflow for auto unpaid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function autoUnpaidWorkflow(page, elements, studentName) {
  await elements.unpaidStudentsLink.click();
  await elements.newStudentsLink.click();
  await markAsPaid(page, elements, studentName);
}

/**
 * Base verification function for auto unpaid students
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} studentName - Student name
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verifyAutoUnpaidStudent(page, studentName, course) {
  console.log(`Verifying auto unpaid student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);
  try {
    await retry(() => elements.studentManagementLink.click());
    await autoUnpaidWorkflow(page, elements, studentName);
    await verifyInActiveStudents(page, elements, studentName, course);
  } catch (error) {
    console.error('Error in auto unpaid student verification:', {
      message: error.message,
      studentName,
      course
    });
    throw error;
  }
}

/**
 * Verify auto unpaid new student (uses config.personal4)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
async function verify_autounpaidnewstudent(page, course) {
  const personal4 = config.personal4;
  const fullName = `${personal4.firstName} ${personal4.lastName}`.trim();
  console.log('Checking auto-unpaid new student');
  await verifyAutoUnpaidStudent(page, fullName, course);
}

module.exports = {
  verify_autounpaidnewstudent
};
