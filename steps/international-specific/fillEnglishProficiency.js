/**
 * English proficiency enrollment step module
 * @module steps/fillEnglishProficiency
 * 
 * Import from: require('../steps/fillEnglishProficiency')
 * 
 * @example
 * const { fillEnglishProficiency } = require('../steps/fillEnglishProficiency');
 * await fillEnglishProficiency(page);
 */

const { config } = require('../../config/config.js');

/**
 * Fills English proficiency test scores section
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function fillEnglishProficiency(page) {
  await page.waitForTimeout(config.timeouts.medium);
  const tests = [
    {
      checkboxId: '#txtEnglishProficiencyTest1',
      scoreWrapper: '#score1',
      scoreInput: '#txtScore1',
      value: '7.5' // IELTS
    },
    {
      checkboxId: '#txtEnglishProficiencyTest2',
      scoreWrapper: '#score2',
      scoreInput: '#txtScore2',
      value: '65' // PTE
    },
    {
      checkboxId: '#txtEnglishProficiencyTest3',
      scoreWrapper: '#score3',
      scoreInput: '#txtScore3',
      value: '176' // CAE
    },
    {
      checkboxId: '#txtEnglishProficiencyTest4',
      scoreWrapper: '#score4',
      scoreInput: '#txtScore4',
      value: 'B2' // OTHER
    }
  ];
  for (const test of tests) {
    const checkBox = page.locator(test.checkboxId)
      .locator('xpath=following-sibling::ins');
    await checkBox.scrollIntoViewIfNeeded();
    await checkBox.click({ force: true });

    await page.waitForSelector(
      `${test.scoreWrapper}:not([style*="display:none"])`,
      { timeout: 5000 }
    );
    await page.locator(test.scoreInput).fill(test.value);
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}

module.exports = {
  fillEnglishProficiency
};
