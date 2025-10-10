// Created by Sumam Sebastian on 10/10/2025
const { expect } = require('@playwright/test');

class CreateTrainerPage {
  constructor(page) {
    this.page = page;
    // Menu navigation
    this.trainerManagementLink = this.page.getByRole('link', { name: ' Trainer Management' });
    this.createTrainerLink = this.page.getByRole('link', { name: 'Create Trainer' });
      this.firstNameSearch = page.locator('input[name="UserTrainersSearch[firstname]"]');
    // Form fields
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username*' });
    this.emailInput = this.page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.titleSelect = this.page.getByLabel('Title');
    this.firstNameInput = this.page.getByRole('textbox', { name: 'First Name*' });
    this.middleNameInput = this.page.getByRole('textbox', { name: 'Middle Name' });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name*' });
    this.dobInput = this.page.getByRole('textbox', { name: 'Date Of Birth' });
    this.genderSelect = this.page.getByLabel('Gender');
    this.mobileInput = this.page.getByRole('textbox', { name: 'Mobile' });
    this.phoneInput = this.page.getByRole('textbox', { name: 'Phone' });
    // Address fields
    this.postBuilding = this.page.locator('#usertrainers-post_building');
    this.postUnit = this.page.locator('#usertrainers-post_unit');
    this.postStreet = this.page.locator('#usertrainers-post_street_address');
    this.postPoBox = this.page.locator('#usertrainers-post_pobox');
    this.postCity = this.page.locator('#usertrainers-post_city_suburb');
    // Course & photo
    this.courseOption = this.page.getByRole('option', { name: '- Course_Sample_01' });
    this.profilePhotoBtn = this.page.getByRole('button', { name: 'Profile Photo' });
    // Same address + Save
    this.sameAsPostLink = this.page.getByRole('link', { name: 'Same as Post >>' });
    this.saveButton = this.page.locator('#personal-details').getByRole('button', { name: 'Save' });
  }
  async navigateToCreateTrainer() {
    await this.trainerManagementLink.click();
    await this.createTrainerLink.click();
  }
  async fillBasicDetails({ username, email, password, title, firstName, middleName, lastName, dob, gender, mobile }) {
  await this.usernameInput.fill(username);  // <-- added
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.titleSelect.selectOption(title);
  await this.firstNameInput.fill(firstName);
  await this.middleNameInput.fill(middleName || '');
  await this.lastNameInput.fill(lastName);
  await this.dobInput.fill(dob);
  await this.genderSelect.selectOption(gender);
  await this.mobileInput.fill(mobile);
}
  async fillAddress({ building, unit, street, pobox, city }) {
    await this.postBuilding.fill(building);
    await this.postUnit.fill(unit);
    await this.postStreet.fill(street);
    await this.postPoBox.fill(pobox);
    await this.postCity.fill(city);
    await this.page.locator('#ui-id-5').click(); // City dropdown suggestion
  }
  async fillContact(phone) {
    await this.phoneInput.fill(phone);
  }

  async selectCourseAndUploadPhoto(photoPath) {
    await this.page.getByRole('list').filter({ hasText: /^$/ }).click();
    await this.courseOption.click();
    await this.profilePhotoBtn.setInputFiles(photoPath);
  }

async copyAddressAndSave() {
    await this.sameAsPostLink.click();
    await this.saveButton.click();
 }
async searchTrainerByFirstName(firstName) {
    await this.firstNameSearch.click();
    await this.firstNameSearch.fill(firstName);
    await this.firstNameSearch.press('Enter');
}

async verifyFirstRowContains(text) {
  // Get the first row
  const firstRow = this.page.locator('table tbody tr').first();
  // Get the Name column (second cell)
  const nameCell = firstRow.locator('td').nth(1);
  // Get the text from the cell
  const nameText = (await nameCell.textContent())?.trim();
  console.log('Name cell text:', JSON.stringify(nameText));
  // Check if first name exists anywhere in the Name column
  if (!nameText.includes(text)) {
    throw new Error(`❌ Name column does not contain expected text: "${text}", actual: "${nameText}"`);
  }
  console.log(`✅ Name column contains: "${text}"`);
}

}
module.exports={CreateTrainerPage};
