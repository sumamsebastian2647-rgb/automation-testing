/**
 * Employer details enrollment step module
 * @module steps/fillEmployerDetails
 * 
 * Import from: require('../steps/international-specific/fillEmployerDetails')
 * 
 * @example
 * const { fillEmployerDetails } = require('../steps/international-specific/fillEmployerDetails');
 * await fillEmployerDetails(page);
 */

const { config } = require('../../config/config.js');

/**
 * Fills employer details form including ABN search
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
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

module.exports = {
  fillEmployerDetails
};
