// ./Pages/ButtonAvailablePage.js
const { expect } = require('@playwright/test');
const config = require('../../config');

class ButtonAvailablePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Buttons
    this.createTrainerBtn = page.getByRole('link', { name: 'Create Trainer' });
    this.showInactiveBtn = page.getByRole('link', { name: 'Show Inactive Trainers' });
    this.showActiveBtn = page.getByRole('link', { name: 'Show Active Trainers' });
    // Table rows to count trainers
    this.trainerRows = page.locator('table tbody tr'); // adjust selector if your table is different
  }
  // Verify Create Trainer button is visible
  async verifyCreateTrainerButton() {
    try {
      await expect(this.createTrainerBtn).toBeVisible();
      console.log('✅ Create Trainer button is visible');
    } catch (error) {
      console.log('❌ TEST FAILED: Create Trainer button is NOT visible');
      throw error;
    }
  }
  // Verify Show Inactive Trainers button is visible
  async verifyShowactiveButton() {
    try {
      await expect(this.showActiveBtn).toBeVisible();
      console.log('✅ Show Active Trainers button is visible');
    } catch (error) {
      console.log('❌ TEST FAILED: Show Active Trainers button is NOT visible');
      throw error;
    }
  }
  // Click Show Inactive Trainers button
  async clickShowActive() {
    try {
      await this.showActiveBtn.click();
      await expect(this.showInactiveBtn).toBeVisible();
      console.log('✅ Show active Trainers button clicked and page switched to Show inactive Trainers');
    } catch (error) {
      console.log('❌ TEST FAILED: Could not click Show active Trainers button or page did not switch');
      throw error;
    }
  }
  // Click Create Trainer button and verify navigation
  async clickCreateTrainer() {
    try {
      await this.createTrainerBtn.click();
      const heading = this.page.getByRole('heading', { name: 'CREATE TRAINER' });
      await expect(heading).toBeVisible();
      console.log('✅ Navigated to Create Trainer page');
    } catch (error) {
      console.log('❌ TEST FAILED: Could not navigate to Create Trainer page');
      throw error;
    }
  }
  // Verify Create Trainer button is hidden if trainer limit reached
  /**
 * Verifies if the Create Trainer button is hidden when the trainer limit is reached
 * @param {number} limit - Maximum number of trainers allowed (defaults to config value)
 */
async verifyCreateButtonHiddenIfLimit(limit = config.Trainer_data.trainerlicence) {
  const trainerCount = await this.trainerRows.count();
  
  // Add debug logging to help troubleshoot issues
  console.log(`DEBUG - Checking trainer limits: Current count=${trainerCount}, License limit=${limit}`);
  
  // Wait for any potential UI updates to complete
  await this.page.waitForTimeout(3000);
  
  try {
    // Check if button exists at all (to diagnose potential selector issues)
    const buttonExists = await this.createTrainerBtn.count() > 0;
    // If it exists, check if it's visible to users or hidden by CSS
    const buttonVisibleToUsers = buttonExists ? await this.createTrainerBtn.isVisible() : false;
    
    console.log(`DEBUG - Button exists in DOM: ${buttonExists}, Visible to users: ${buttonVisibleToUsers}`);
    
    if (trainerCount >= limit) {
      // CASE 1: Trainer limit reached - button should NOT be visible
      
      // Option 1: Check if button doesn't exist in DOM (stricter)
      // await expect(this.createTrainerBtn).toHaveCount(0);
      
      // Option 2: Check if button exists but is not visible (allows for hidden elements)
      await expect(this.createTrainerBtn).not.toBeVisible();
      
      console.log(`✅ Trainer limit reached (${trainerCount}/${limit}). Create Trainer button is NOT visible as expected.`);
    } else {
      // CASE 2: Below trainer limit - button should be visible
      await expect(this.createTrainerBtn).toBeVisible();
      console.log(`✅ Trainer count (${trainerCount}/${limit}) below limit. Create Trainer button is visible.`);
    }
  } catch (error) {
    // Enhanced error reporting
    if (trainerCount >= limit) {
      console.log(`❌ TEST FAILED: Trainer limit reached (${trainerCount}/${limit}) but Create Trainer button is still visible.`);
      console.log(`Error details: ${error.message}`);
      
      // Additional diagnostics for this failure case
      const buttonAttributes = await this.createTrainerBtn.evaluate(el => {
        return {
          isVisible: el.offsetParent !== null,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          cssClasses: el.className
        };
      }).catch(e => 'Could not get element details');
      
      console.log(`Button diagnostics:`, buttonAttributes);
    } else {
      console.log(`❌ TEST FAILED: Trainer count (${trainerCount}/${limit}) below limit but Create Trainer button is NOT visible.`);
      console.log(`Error details: ${error.message}`);
    }
    throw error; // rethrow so test still fails
  }
}

}
module.exports = { ButtonAvailablePage };
