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
  async verifyShowInactiveButton() {
    try {
      await expect(this.showInactiveBtn).toBeVisible();
      console.log('✅ Show Inactive Trainers button is visible');
    } catch (error) {
      console.log('❌ TEST FAILED: Show Inactive Trainers button is NOT visible');
      throw error;
    }
  }

  // Click Show Inactive Trainers button
  async clickShowInactive() {
    try {
      await this.showInactiveBtn.click();
      await expect(this.showActiveBtn).toBeVisible();
      console.log('✅ Show Inactive Trainers button clicked and page switched to Show Active Trainers');
    } catch (error) {
      console.log('❌ TEST FAILED: Could not click Show Inactive Trainers button or page did not switch');
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
  async verifyCreateButtonHiddenIfLimit(limit = config.Trainer_data.trainerlicence) {
    const trainerCount = await this.trainerRows.count();

    try {
      if (trainerCount >= limit) {
        // Button should NOT exist
        await expect(this.createTrainerBtn).toHaveCount(0);
        console.log(`✅ Trainer limit reached (${trainerCount}). Create Trainer button is NOT visible as expected.`);
      } else {
        // Button should be visible
        await expect(this.createTrainerBtn).toBeVisible();
        console.log(`✅ Trainer count (${trainerCount}) below limit. Create Trainer button is visible.`);
      }
    } catch (error) {
      if (trainerCount >= limit) {
        console.log(`❌ TEST FAILED: Trainer limit reached (${trainerCount}) but Create Trainer button is still present.`);
      } else {
        console.log(`❌ TEST FAILED: Trainer count (${trainerCount}) below limit but Create Trainer button is NOT visible.`);
      }
      throw error; // rethrow so test still fails
    }
  }
}

module.exports = { ButtonAvailablePage };
