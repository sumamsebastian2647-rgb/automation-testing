/**
 * Financial declaration enrollment step module
 * @module steps/fillFinancialDeclaration
 * 
 * Import from: require('../steps/fillFinancialDeclaration')
 * 
 * @example
 * const { fillFinancialDeclaration } = require('../steps/fillFinancialDeclaration');
 * await fillFinancialDeclaration(page);
 */

const { config } = require('../../config/config.js');

/**
 * Fills Financial Declaration section
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function fillFinancialDeclaration(page) {
  await page.waitForTimeout(config.timeouts.medium);
  const checkbox = page
    .locator('#txtDesclaimerFinancial')
    .locator('xpath=following-sibling::ins');
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.click({ force: true });
  await page.waitForTimeout(config.timeouts.short);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}

module.exports = {
  fillFinancialDeclaration
};
