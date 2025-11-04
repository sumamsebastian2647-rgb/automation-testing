// Created by Sumam Sebastian on 09/10/2025
const { expect } = require('@playwright/test');

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.trainerManagementLink = page.getByRole('link', { name: ' Trainer Management' });
      this.firstnameSearch = page.locator(
      '#trainers-by-rto-grid-filters input[name="UserTrainersSearch[firstname]"]'
    );
    this.nameCell = page.locator('table tbody tr:first-child td:nth-child(2)'); // adjust column index if needed
    this.usernameSearch = page.locator('#trainers-by-rto-grid-filters input[name="UserTrainersSearch[username]"]');
    this.emailSearch = page.locator('#trainers-by-rto-grid-filters input[name="UserTrainersSearch[email]"]');
    this.mobileSearch = page.locator('#trainers-by-rto-grid-filters input[name="UserTrainersSearch[mobile]"]');
 }
  async openTrainerManagement() {
    await this.trainerManagementLink.click();
    await this.page.getByRole('link', { name: 'Show Inactive Trainers' }).click();
  }
 
// Generic search method
  async search(locator, value) {
    await locator.fill('');
    await locator.fill(value);
    await locator.press('Enter');
    // optional small wait for table update
    await this.page.waitForTimeout(500);
  }

  // Specific search methods
  async searchByUsername(username) {
    await this.search(this.usernameSearch, username);
  }

  async searchByEmail(email) {
    await this.search(this.emailSearch, email);
  }

  async searchByMobile(mobile) {
    await this.search(this.mobileSearch, mobile);
  }
 // Verify first row contains expected value in any column
  async verifyFirstRowContains1(columnIndex, expectedValue) {
    const firstRow = this.page.locator(
      `#trainers-by-rto-grid-container table tbody tr:first-child td:nth-child(${columnIndex})`
    );
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    const text = await firstRow.innerText();
    if (text.toLowerCase().includes(expectedValue.toLowerCase())) {
      console.log(`✅ Test passed: Found "${expectedValue}"`);
    } else {
      throw new Error(`❌ Expected "${expectedValue}" but found "${text}"`);
    }
  }
 async searchTrainer(firstname) {
  const input = this.firstnameSearch;
  await input.fill(''); // clear previous value
  await input.fill(firstname);
  await input.press('Enter');
  // Wait for the first row to reflect the search OR show "No results"
  await this.page.waitForFunction(
    (name) => {
      const row = document.querySelector(
        '#trainers-by-rto-grid-container table tbody tr:first-child td[data-col-seq="1"]'
      );
      if (!row) return true; // no results
      return row.innerText.toLowerCase().includes(name.toLowerCase()) || row.innerText.includes('No results found.');
    },
    firstname
  );
}
 
 async verifyFirstRowContains(expectedPartialName) {
    const firstRow = this.page.locator(
      '#trainers-by-rto-grid-container table tbody tr:first-child td[data-col-seq="1"]'
    );
    await firstRow.waitFor({ state: 'visible' });
    const firstRowText = await firstRow.innerText();
    if (firstRowText.toLowerCase().includes(expectedPartialName.toLowerCase())) {
      console.log('✅ Test passed successfully');
    } else {
      throw new Error(`❌ Name "${expectedPartialName}" not found in first cell, found: "${firstRowText}"`);
    }
  }
  async verifyNoResults() {
    await this.page.getByText('No results found.').waitFor({ state: 'visible' });
  }
}



module.exports = { DashboardPage };
