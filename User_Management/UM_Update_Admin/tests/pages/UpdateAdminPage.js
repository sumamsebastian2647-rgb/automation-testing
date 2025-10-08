// @ts-check
const { expect } = require('@playwright/test');
const config = require('../../config');

class UpdateAdminPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    //this.updateLink = page.getByRole('link', { name: 'Update' }) ;
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.phoneNumberInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.addressInput = page.getByRole('textbox', { name: 'Address' });
    this.jobRoleSelect = page.getByLabel('Job Role');
    this.cityInput = page.getByRole('textbox', { name: 'City/Suburb' });
    this.saveButton = page.locator('button.btn.btn-success.btn-flat:has-text("Save")').first();
  }

  async navigateToCreateAdmin() {
    await this.userManagementLink.click();
    await this.page.locator('a[title="Update"]').first().click();

  }

  async fillAdminForm() {
    
    await this.emailInput.fill(config.personalInfo.email);
    await this.passwordInput.fill(config.personalInfo.defaultPassword);
    await this.firstNameInput.fill(config.personalInfo.firstname);
    await this.lastNameInput.fill(config.personalInfo.lastname);
    await this.phoneNumberInput.fill(config.personalInfo.phoneNumber);
    await this.page.locator('#userbyrto-ubr_job_role').selectOption({ label: 'Sales Manager' });
    await this.addressInput.fill(config.addressInfo.address);
    await this.cityInput.fill(config.addressInfo.city);
    await this.page.waitForSelector('.ui-menu-item');
    await this.page.click('.ui-menu-item >> nth=0');
  }
  
async fillAdminFormWithBlanks() {

  await this.emailInput.fill('');
  await this.passwordInput.fill('');
  await this.firstNameInput.fill('');
  await this.lastNameInput.fill('');
}

  async saveAdmin() {
    await this.saveButton.click();
  }



}

module.exports = { UpdateAdminPage };
