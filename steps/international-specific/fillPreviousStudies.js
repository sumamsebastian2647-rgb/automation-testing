/**
 * Previous studies enrollment step module
 * @module steps/fillPreviousStudies
 * 
 * Import from: require('../steps/fillPreviousStudies')
 * 
 * @example
 * const { fillPreviousStudies } = require('../steps/fillPreviousStudies');
 * await fillPreviousStudies(page);
 * // Or with custom data:
 * await fillPreviousStudies(page, customStudiesData);
 */

const { config } = require('../../config/config.js');

/**
 * Fills previous studies information in a form
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} [studiesData=config.previousStudies] - Previous studies data (optional, defaults to config.previousStudies)
 * @returns {Promise<void>}
 */
async function fillPreviousStudies(page, studiesData) {
  // Use provided data or fall back to config
  const data = studiesData || config.previousStudies;
  await page.waitForTimeout(config.timeouts.medium);
  
  // Have you previously studied in Australia?
  if (data.studiedInAustralia) {
    await page.locator('#txtPreviousStudyInAus').selectOption(data.studiedInAustralia);
    await page.waitForTimeout(config.timeouts.short);
  }
  
  // Are you transferring from another education provider?
  if (data.transferFromAnother) {
    await page.locator('#txtTransferFromAnother').selectOption(data.transferFromAnother);
    await page.waitForTimeout(config.timeouts.short);
  }
  
  // Did you complete your course?
  if (data.completeCourse) {
    await page.locator('#txtCompleteCourse').selectOption(data.completeCourse);
    await page.waitForTimeout(config.timeouts.short);
    
    // If completed course is "Yes", attach transcript
    if (data.completeCourse === '1' && data.transcriptPath) {
      await page.waitForSelector('#divCompleteCourse:not([style*="display:none"])', { timeout: 5000 });
      await page.locator('#fileCompleteCourseTranscript').setInputFiles(data.transcriptPath);
    }
  }
  
  // Do you have a release letter?
  if (data.releaseLetter) {
    await page.locator('#txtReleaseLetter').selectOption(data.releaseLetter);
    await page.waitForTimeout(config.timeouts.short);
    
    // If release letter is "Yes", attach release letter
    if (data.releaseLetter === '1' && data.releaseLetterPath) {
      await page.waitForSelector('#divReleaseLetter:not([style*="display:none"])', { timeout: 5000 });
      await page.locator('#fileReleaseLetter').setInputFiles(data.releaseLetterPath);
    }
  }
  
  // Highest qualification in Australia
  if (data.highestQualificationAus) {
    await page.locator('#txtHighestQualificationAus').fill(data.highestQualificationAus);
  }
  
  // Highest qualification from Overseas
  if (data.highestQualificationOverseas) {
    await page.locator('#txtHighestQualificationOve').fill(data.highestQualificationOverseas);
  }
  
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}

module.exports = {
  fillPreviousStudies
};
