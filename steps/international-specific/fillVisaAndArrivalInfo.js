/**
 * Visa and arrival information enrollment step module
 * @module steps/fillVisaAndArrivalInfo
 * 
 * Import from: require('../steps/fillVisaAndArrivalInfo')
 * 
 * @example
 * const { fillVisaAndArrivalInfo } = require('../steps/fillVisaAndArrivalInfo');
 * await fillVisaAndArrivalInfo(page);
 * // Or with custom data:
 * await fillVisaAndArrivalInfo(page, customVisaData);
 */

const { config } = require('../../config/config.js');
const { expect } = require('@playwright/test');

/**
 * Fills visa and arrival information in a form
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} [visaData=config.visa] - Visa and arrival data (optional, defaults to config.visa)
 * @returns {Promise<void>}
 */
async function fillVisaAndArrivalInfo(page, visaData) {
  const data = visaData || config.visa;
  
  // Wait for page to be ready
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check if we're on the right page by looking for the visa section
  const pageTitle = await page.title();
  console.log(`Current page title: ${pageTitle}`);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: `visa-page-${Date.now()}.png` });
  
  // Check if the element exists in the DOM at all
  const elementExists = await page.locator('#select2-txtVCountryofCitizen-container').count();
  console.log(`Nationality dropdown count: ${elementExists}`);
  
  if (elementExists === 0) {
    console.error('Visa and Arrival Info section not found. Current URL:', page.url());
    throw new Error('Visa and Arrival Info page did not load. Check if previous step clicked Next button.');
  }
  
  // Nationality
  await page.locator('#select2-txtVCountryofCitizen-container').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('#select2-txtVCountryofCitizen-container').click();
  await page.getByRole('option', { name: data.nationality, exact: true }).click();
  
  // Country of Birth
  await page.locator('#select2-txtVCountryofbirth-container').click();
  await page.getByRole('option', { name: data.countryOfBirth, exact: true }).click();
  
  // City of Birth
  await page.getByRole('textbox', { name: 'City of Birth' }).fill(data.cityOfBirth);
  
  // First Language
  const firstLanguageSelect = page.locator('span.select2-selection--single').filter({ has: page.locator('#select2-txtVFirstLanguage-container') });
  await expect(firstLanguageSelect).toBeVisible();
  await firstLanguageSelect.click();
  const options = page.locator('#select2-txtVFirstLanguage-results li.select2-results__option:visible');
  const count = await options.count();
  expect(count).toBeGreaterThan(1);
  await options.filter({ hasText: /.+/ }).nth(1).click();
  
  // Passport Number
  await page.getByRole('textbox', { name: 'Passport Number' }).fill(data.passportNumber);

  // Do you currently hold Australian Visa?
  const holdVisaSelect = page
    .locator('span.select2-selection--single')
    .filter({ has: page.locator('#select2-txtHoldAusVisa-container') });
  await expect(holdVisaSelect).toBeVisible();
  await holdVisaSelect.scrollIntoViewIfNeeded();
  await holdVisaSelect.click();
  
  // Select Yes / No
  await page.locator('#select2-txtHoldAusVisa-results li.select2-results__option:visible').filter({ hasText: data.holdAusVisa ? 'Yes' : 'No' }).first().click();
  
  if (data.holdAusVisa) {
    await page.getByRole('textbox', {
      name: 'When did you first arrive in Australia?'
    }).fill(data.firstArrival);

    await page.locator('#txtVisaType').selectOption(data.visaType);
    if (data.visaType === '2' && data.visaTypeOther) {
      await page.getByRole('textbox', { name: 'txtVisaTypeOther' })
        .fill(data.visaTypeOther);
    }
    await page.getByRole('textbox', { name: 'Visa Number' })
      .fill(data.visaNumber);
    if (data.visaCopyPath) {
      await page.locator('#fileVisaCopy')
        .setInputFiles(data.visaCopyPath);
    }
    if (data.passportCopyPath) {
      await page.locator('#filePassportCopy')
        .setInputFiles(data.passportCopyPath);
    }
  } else {
    if (data.whereVisa) {
      await page.locator('#txtWhereVisa')
        .selectOption(data.whereVisa);
    }
  }
  
  // OSHC
  if (data.requireOSHC) {
    await page.locator('#select2-txtRequireOSHC-container').click();
    const oshcOptions = {
      '1': 'Yes - Single',
      '2': 'Yes - Couple',
      '3': 'Yes - Family',
      '4': 'No'
    };
    await page.getByRole('option', {
      name: oshcOptions[data.requireOSHC]
    }).click();
    if (data.requireOSHC === '4' && data.validOSHCPath) {
      await page.locator('#fileValidOSHC')
        .setInputFiles(data.validOSHCPath);
    }
  }
  
  // Airport pickup
  if (data.requireAirport !== undefined) {
    await page.locator('#txtRequireAirport')
      .selectOption(data.requireAirport ? '1' : '0');
  }
  
  // Homestay
  if (data.requireHomestay !== undefined) {
    await page.locator('#txtRequireHomestay')
      .selectOption(data.requireHomestay ? '1' : '0');
  }
  
  // Under 18
  if (data.underEighteen !== undefined) {
    await page.locator('#txtUnderEighteen')
      .selectOption(data.underEighteen ? '1' : '0');
  }
  
  // GTE awareness
  if (data.borderProtection !== undefined) {
    await page.locator('#txtBorderProtection')
      .selectOption(data.borderProtection ? '1' : '0');
  }
  
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000);
}

module.exports = {
  fillVisaAndArrivalInfo
};
