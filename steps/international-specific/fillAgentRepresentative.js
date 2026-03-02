/**
 * Agent representative enrollment step module
 * @module steps/fillAgentRepresentative
 * 
 * Import from: require('../steps/fillAgentRepresentative')
 * 
 * @example
 * const { fillAgentRepresentative } = require('../steps/fillAgentRepresentative');
 * await fillAgentRepresentative(page);
 */

const { config } = require('../../config/config.js');

/**
 * Fills agent/representative information step
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function fillAgentRepresentative(page) {
  const agentData = config.agentRepresentative;
  await page.waitForTimeout(config.timeouts.medium);
  
  // Agency details
  if (agentData.agencyName) {
    const agencyName = page.locator('#txtAgencyName');
    await agencyName.waitFor({ state: 'visible', timeout: 10000 });
    await agencyName.fill(agentData.agencyName);
  }

  if (agentData.agencyEmail) {
    const agencyEmail = page.locator('#txtAgencyEmail');
    await agencyEmail.waitFor({ state: 'visible', timeout: 10000 });
    await agencyEmail.fill(agentData.agencyEmail);
  }

  if (agentData.agencyAddress) {
    const agencyAddress = page.locator('#txtAgencyAddress');
    await agencyAddress.waitFor({ state: 'visible', timeout: 10000 });
    await agencyAddress.fill(agentData.agencyAddress);
  }

  if (agentData.contactPerson) {
    const contactPerson = page.locator('#txtAgencyContactPerson');
    await contactPerson.waitFor({ state: 'visible', timeout: 10000 });
    await contactPerson.fill(agentData.contactPerson);
  }

  if (agentData.contactNumber) {
    const contactNumber = page.locator('#txtAgencyContactNumber');
    await contactNumber.waitFor({ state: 'visible', timeout: 10000 });
    await contactNumber.fill(agentData.contactNumber);
  }
  
  // Signature (if required)
  if (agentData.requiresSignature) {
    const signaturePad = page.locator('#agent-signature-pad');
    await signaturePad.scrollIntoViewIfNeeded();
    await signaturePad.click({
      position: { x: 200, y: 100 }
    });
    await page.waitForTimeout(config.timeouts.short);
  }

  // Next
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(config.timeouts.medium);
}

module.exports = {
  fillAgentRepresentative
};
