// @ts-check
const { expect } = require('@playwright/test');

class CreateAdminPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    this.createAdminLink = page.getByRole('link', { name: 'Create Admin' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username*' });
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
    await this.createAdminLink.click();
  }

  async fillAdminForm(adminData) {
    await this.usernameInput.fill(adminData.username);
    await this.emailInput.fill(adminData.email);
    await this.passwordInput.fill(adminData.password);
    await this.firstNameInput.fill(adminData.firstName);
    await this.lastNameInput.fill(adminData.lastName);
    await this.phoneNumberInput.fill(adminData.phoneNumber);
    await this.addressInput.fill(adminData.address);
    await this.jobRoleSelect.selectOption(adminData.jobRole);
    await this.cityInput.fill(adminData.city);
    await this.page.waitForSelector('.ui-menu-item');
    await this.page.click('.ui-menu-item >> nth=0');
  }
  
async fillAdminFormWithBlanks() {
  await this.usernameInput.fill('');
  await this.emailInput.fill('');
  await this.passwordInput.fill('');
  await this.firstNameInput.fill('');
  await this.lastNameInput.fill('');
}

  async saveAdmin() {
    await this.saveButton.click();
  }

 async VerifyAdmin(adminData) {
  const nameFilter = this.page.locator('input[name="UserByRtoSearch[ubr_firstname]"]');
  await nameFilter.fill(adminData.firstName);
  console.log(adminData.firstName);
  await nameFilter.press('Enter');
  // Verify the cell containing the expected full name is visible
  const nameCell = this.page.getByRole('cell', { name: adminData.firstName }).first();
  await expect(nameCell).toBeVisible({ timeout: 5000 });
  console.log(`✅ Verified admin: ${adminData.firstName} is present in the dashboard`);
}

}

module.exports = { CreateAdminPage };
