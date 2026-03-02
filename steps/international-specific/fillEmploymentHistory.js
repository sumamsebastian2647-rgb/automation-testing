/**
 * Employment history enrollment step module
 * @module steps/fillEmploymentHistory
 * 
 * Import from: require('../steps/fillEmploymentHistory')
 * 
 * @example
 * const { fillEmploymentHistory } = require('../steps/fillEmploymentHistory');
 * await fillEmploymentHistory(page);
 */

const { config } = require('../../config/config.js');

/**
 * Fills employment history section with dynamic row addition
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
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

module.exports = {
  fillEmploymentHistory
};
