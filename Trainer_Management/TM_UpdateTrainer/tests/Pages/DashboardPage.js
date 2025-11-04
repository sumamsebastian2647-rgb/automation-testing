// ./Pages/DashboardPage.js
const { expect } = require('@playwright/test');
class DashboardPage {
  constructor(page) {
    this.page = page;
    // LINKS & NAV
    this.trainerManagementLink = page.getByRole('link', { name: ' Trainer Management' });
    this.createTrainerButton = page.getByRole('link', { name: 'Create Trainer' });
    this.professionalDevelopmentLink = page.getByRole('link', { name: 'Professional Development' });
    this.otherDocsLink = page.getByRole('link', { name: 'Other Documents' });
    this.workExperienceTab = page.getByRole('link', { name: 'Work Experience' });
    this.qualification = page.getByRole('link', { name: 'Qualification' });
    this.trainerMatrixLink = page.getByRole('link', { name: 'Trainer Matrix' });
    // DOCUMENT FORM
    this.addDocBtn = page.getByRole('button', { name: 'Add Document' });
    this.docNameInput = page.getByRole('textbox', { name: 'Document Name*' });
    this.docUploadBtn = page.getByRole('button', { name: 'Document*' });
    this.saveBtn = page.locator('#formTrainerOtherDocuments').getByRole('button', { name: 'Save' });
    this.searchInput = page.locator('input[name="UserTrainersOtherDocumentsSearch[document_name]"]');
    // BUTTONS
    this.addPDButton = page.locator('#btnAddPD'); // Use ID selector for the button
    this.savePDButton = page.locator('#formTrainerPD').getByRole('button', { name: 'Save' });
    this.attachEvidenceButton = page.getByRole('button', { name: 'Attach Evidence' });
    // FIELDS
    this.organisationNameInput = page.getByRole('textbox', { name: 'Organisation Name*' });
    this.totalHoursInputdata = page.getByRole('spinbutton', { name: 'Total Hours' });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date*' });
    this.endDateInput = page.getByRole('textbox', { name: 'End Date*' });
    this.expiryDateInput = page.getByRole('textbox', { name: 'Date of Expiry' });
    this.activityDetailsInput = page.getByRole('textbox', { name: 'Activity Details' });
       // Search inputs
    this.organisationSearchInput = page.locator('input[name="UserTrainersProfessionalDevelopmentSearch[organisation_name]"]');
    this.notifyBeforeSelect = page.locator('select[name="UserTrainersProfessionalDevelopmentSearch[notify_before]"]');
    this.totalHoursInput = page.locator('input[name="UserTrainersProfessionalDevelopmentSearch[total_hours]"]');
        // ADD WORK EXPERIENCE
    this.addWorkExpBtn = page.getByRole('button', { name: 'Add Work Experience' });
    this.orgNameInput = page.getByRole('textbox', { name: 'Organisation Name*' });
    this.jobRoleInput = page.getByRole('textbox', { name: 'Job Role*' });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date*' });
    this.jobDescriptionInput = page.locator('textarea[name="UserTrainersWorkExperience[comment]"]');
    this.saveBtn = page.locator('#formTrainerWorkExperience').getByRole('button', { name: 'Save' });
    // TABLE FIRST ROW
    this.firstRow = page.locator('tbody tr').first();
    this.firstOrgCell = this.firstRow.locator('td[data-col-seq="1"]');
    this.firstJobCell = this.firstRow.locator('td[data-col-seq="2"]');
    this.firstUpdateBtn = page.locator('a[href*="update-work-experience"]');
    this.deleteWorkExpBtn = page.locator('a[href*="delete-work-experience"]');
    this.okBtn = page.getByText('Ok', { exact: true });
    // UPDATE SAVE BUTTON (appears with validation message)
    this.updateSaveBtn = page.locator('form').filter({ hasText: 'Please fix the following' }).getByRole('button');
      //////////////////// tRAINER MATRIX
    this.competencyInput = page.locator('input[name="UserTrainersMatrix[competency][]"]');
    this.equivalentCompetencyInput = page.locator('input[name="UserTrainersMatrix[equivalent_competency][]"]');
    this.qualificationSelect = page.locator('select[name="UserTrainersMatrix[utm_utq_id][]"]');
    this.workExpSelect = page.locator('select[name="UserTrainersMatrix[utm_utwe_id][]"]');
    this.commentsTextArea = page.locator('textarea[name="UserTrainersMatrix[comments][]"]');
    this.saveButton = page.locator('#trainer-matrix').getByRole('button', { name: 'Save' });
    this.deleteIcon = page.locator('a[title="Delete this row"]');
      // BASIC DETAILS
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.dobInput = page.getByRole('textbox', { name: 'Date Of Birth' });
    this.genderSelect = page.getByLabel('Gender');
    this.mobileInput = page.getByRole('textbox', { name: 'Mobile' });

    // ADDRESS FIELDS
    this.postBuilding = page.locator('#usertrainers-post_building');
    this.postUnit = page.locator('#usertrainers-post_unit');
    this.postStreet = page.locator('#usertrainers-post_street_address');
    this.postPoBox = page.locator('#usertrainers-post_pobox');
    this.postCity = page.locator('#usertrainers-post_city_suburb');
    this.citySuggestion = page.locator('#ui-id-174');

    // COURSE & UPLOAD
    this.courseOption = page.getByRole('option', { name: '10944NAT - Diploma of' });
    this.profilePhotoBtn = page.getByRole('button', { name: 'Profile Photo' });

    // SAVE & CONFIRMATION
    this.saveBtn = page.locator('#personal-details').getByRole('button', { name: 'Save' });
    this.successMsg = page.getByText('Trainer details has been');
  }
  
  
  // NAVIGATION
  async openTrainerManagement() {
    await this.trainerManagementLink.click();
  }
  async openUpdateTrainer() {
    await this.page.locator('table tbody tr:first-child a[title="update"]').click();
  }
  async navigateToPD() {
       await this.professionalDevelopmentLink.click();
  }
  
  async openUpdateTrainerdoc() {
        await this.otherDocsLink.click();
  }
 
  // ----------- BASIC DETAILS -----------
  async fillBasicDetails({ email, firstName, lastName, dobDay, gender, mobile }) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dobInput.click();
    await this.page.getByRole('link', { name: dobDay, exact: true }).click();
    await this.genderSelect.selectOption(gender);
    await this.mobileInput.fill(mobile);
  }

  // ----------- ADDRESS DETAILS -----------
  async fillAddress({ building, unit, street, pobox, city }) {
  await this.postBuilding.fill(building);
  await this.postUnit.fill(unit);
  await this.postStreet.fill(street);
  await this.postPoBox.fill(pobox);
  await this.postCity.fill(city);

  // Wait for city suggestion dropdown and select the first option
  const firstSuggestion = this.page.locator('.ui-menu-item-wrapper').first();
  await firstSuggestion.waitFor({ state: 'visible', timeout: 5000 });
  await firstSuggestion.click();
}


  // ----------- COURSE & UPLOAD -----------
  async selectCourseAndUploadPhoto(photoPath) {
    await this.page.getByRole('list').filter({ hasText: /^$/ }).click();
    await this.courseOption.click();
    await this.profilePhotoBtn.setInputFiles(photoPath);
  }

  // ----------- SAVE -----------
  async saveTrainer() {
    await this.saveBtn.click();
    await expect(this.successMsg).toBeVisible({ timeout: 5000 });
  }
  async clickSave_otherdocument() {
  this.saveButton = this.page.locator('#formTrainerOtherDocuments button.btn-success.btn-flat');
  await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
  await this.saveButton.click();
}
  // UPLOAD DOCUMENT
  async uploadOtherDocument(filePath, docName) {
    await this.addDocBtn.click();
    await this.docNameInput.fill(docName);
    await this.docUploadBtn.setInputFiles(filePath);
    await this.clickSave_otherdocument();
  }
  // VERIFY DOCUMENT EXISTS IN FIRST ROW
  async verifyFirstRowHasDocument(docName) {
    await this.searchInput.fill(docName);
    await this.searchInput.press('Enter');
    const firstRow = this.page.locator('table tbody tr:first-child');
    const docLink = firstRow.locator('a[target="_blank"]').first();
    const linkText = await docLink.innerText();
    if (linkText.toLowerCase().includes(docName.toLowerCase())) {
      console.log(`✅ Document "${docName}" found — SUCCESSFUL`);
    } else {
      console.log(`❌ Document "${docName}" NOT found`);
      await expect(linkText).toContain(docName); // fails test if not found
    }
    return docLink; // return locator if you want to click outside
  }
  // CLICK FIRST DOCUMENT LINK
  async clickFirstDocument() {
    const firstRow = this.page.locator('table tbody tr:first-child');
    const docLink = firstRow.locator('a[target="_blank"]').first();
    await docLink.click();
  }
  // DELETE FIRST DOCUMENT
  async deleteFirstDocument() {
    await this.otherDocsLink.click();
    const deleteIcon = this.page.getByRole('link', { name: '' }).first();
    const okBtn = this.page.getByText('Ok', { exact: true });
    const deleteToast = this.page.getByText('Document has been deleted');
    await deleteIcon.click();
    await okBtn.click();
    await deleteToast.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ First document deleted successfully');
  }
 

  async assertRequiredErrors() {
    const errorList = this.page.locator('ul > li');
    await expect(
        errorList.filter({ hasText: 'Document Name cannot be blank' })
    ).toBeVisible({ timeout: 10000 });
    await expect(
        errorList.filter({ hasText: 'Document cannot be blank' })
    ).toBeVisible({ timeout: 10000 });
  }
  async addProfessionalDevelopment(pdData) {
    //await this.addPDButton.click();
    await this.organisationNameInput.fill(pdData.organisationName);
    await this.totalHoursInputdata.fill(pdData.totalHours.toString());
    await this.page.locator('#usertrainersprofessionaldevelopment-start_date').fill(pdData.startDate);
    await this.page.locator('#usertrainersprofessionaldevelopment-end_date').fill(pdData.endDate);
    await this.page.locator('#usertrainersprofessionaldevelopment-expiry_date').fill(pdData.expiryDate);
    await this.activityDetailsInput.fill(pdData.activityDetails);
   
    await this.attachEvidenceButton.setInputFiles(pdData.evidenceFiles);
    await this.savePDButton.click();
  }
  async searchPDByOrganisation(name) {
    await this.searchByOrganisation.fill(name);
    await this.searchByOrganisation.press('Enter');
  }
  async verifyPDAdded(name) {
    const rows = this.page.locator('table tbody tr');
    // Wait for any data row to appear (search result)
    await expect(rows.first()).toBeVisible();
    // Now assert first row has our text
    await expect(rows.first().getByText(name, { exact: true })).toBeVisible();
  }
  async updatePD(pdData) {
    // assumes you are already inside PD edit page
   // Click the first row edit (pencil) icon
    await this.page.locator('a[title="Update Professional Development"]').first().click();
    await this.page.getByRole('textbox', { name: 'Organisation Name*' }).fill(pdData.orgName);
   await this.page.locator('#usertrainersprofessionaldevelopment-start_date').fill(pdData.startDate);
    await this.page.locator('#usertrainersprofessionaldevelopment-end_date').fill(pdData.endDate);
       
  }
  async deletePD() {
       await this.page.locator('a[title="Delete Professional Development"]').first().click();
  // Confirm delete (assuming modal with "Ok")
    await this.page.getByText('Ok', { exact: true }).click();
       // ✅ Validate delete toast
    await expect(this.page.getByText('Professional development has been deleted successfully.')).toBeVisible();
  }

  // --- Search by Organisation Name
  async searchByOrganisation(name) {
    await this.organisationSearchInput.click();
    await this.organisationSearchInput.fill(name);
    await this.organisationSearchInput.press('Enter');
    // Optional: assert first cell contains search term
    const firstCell = this.page.getByText(name, { exact: true }).first();
    await expect(firstCell).toBeVisible();
  }
  // --- Clear organisation filter
  async clearOrganisationFilter() {
    await this.organisationSearchInput.click();
    await this.organisationSearchInput.fill('');
    await this.organisationSearchInput.press('Enter');
  }
   
   // --- Clear organisation filter
  async cleartotalhoursFilter() {
    await this.totalHoursInput.click();
    await this.totalHoursInput.fill('');
    await this.totalHoursInput.press('Enter');
  }
  // --- Filter Notify Before
  async filterNotifyBefore(value) {
    await this.notifyBeforeSelect.selectOption(value);
    // Optional: wait for table reload
    await this.page.waitForLoadState('networkidle');
  }
  // --- Filter Total Hours
  async filterTotalHours(hours) {
    await this.totalHoursInput.click();
    await this.totalHoursInput.fill(hours.toString());
    await this.totalHoursInput.press('Enter');
    // Optional: verify first cell
    const firstCell = this.page.getByRole('cell', { name: hours.toString() }).first();
    await expect(firstCell).toBeVisible();
  }
  //////////////////Work Experience//////////////////////
  async navigateToWorkExperience() {
    await this.workExperienceTab.click();
  }
async addWorkExperience(org, role, desc) {
    await this.addWorkExpBtn.click();
    await this.orgNameInput.fill(org);
    await this.jobRoleInput.fill(role);
    //await this.startDateInput.click();
    // Step 5️⃣ - Select Start Date safely
   await this.page.locator('#usertrainersworkexperience-start_date').fill('01-10-2020');
    await this.page.locator('#usertrainersworkexperience-start_date').press('Tab'); // closes calendar
    //await this.page.getByRole('link', { name: '1', exact: true }).click();
    await this.jobDescriptionInput.fill(desc);
      await this.page.locator('.box-footer').getByRole('button', { name: 'Save' }).click();

  }

  async clickUpdateOnFirstRow() {
    await this.firstUpdateBtn.first().click();
  }
  async updateWorkExperience(org, desc) {
    await this.orgNameInput.fill(org);
    await this.jobDescriptionInput.fill(desc);
    await this.updateSaveBtn.click();
  }
  async clickDeleteOnFirstRow() {
    await this.deleteWorkExpBtn.first().click();
      await this.page.getByText('Ok', { exact: true }).click();
  }
// Click the Qualifications tab
  async navigateToQualifications() {
    await this.qualification.click();
  }
  async addQualification(name, institution, year, expiryDate, comment, filePath) {
    //await this.page.getByRole('button', { name: 'Add Qualification' }).click();
      await this.page.locator('#btnAddQualification').click();
    await this.page.getByRole('textbox', { name: 'Qualification Name*' }).fill(name);
    await this.page.getByRole('spinbutton', { name: 'Year Completed*' }).fill(year);
    await this.page.getByRole('textbox', { name: 'Institution*' }).fill(institution);
    // Expiry date optional — only if provided
   // Fill expiry date manually
    await this.page.fill('#usertrainersqualifications-expiry_date', '01-10-2026');


    if (comment) {
      await this.page.getByRole('textbox', { name: 'Comment' }).fill(comment);
    }

    if (filePath) {
      await this.page.getByRole('button', { name: 'Attach Evidence*' }).setInputFiles(filePath);
    }

    await this.page.locator('#formTrainerQualification').getByRole('button', { name: 'Save' }).click();
  }

  // Click UPDATE on first row
  async updateQualification(name, institution, comment, expiryDate) {
    // Click first UPDATE button in table (based on href)
    await this.page.locator('a[href*="update-qualification"]').first().click();
  await this.page.getByRole('textbox', { name: 'Qualification Name*' }).fill(name);
    await this.page.getByRole('textbox', { name: 'Institution*' }).fill(institution);
    await this.page.getByRole('textbox', { name: 'Comment' }).fill(comment);
    await this.page.getByRole('textbox', { name: 'Date of Expiry' }).fill(expiryDate);

    // Save
    await this.page.locator('form').filter({ hasText: 'Qualification' }).getByRole('button', { name: 'Save' }).click();
  }
  // DELETE first row
  async clickDeleteOnFirstQualification() {
    await this.page.locator('a[href*="delete-qualification"]').first().click();
  // accept JS confirm popup triggered by data-confirm
  await this.page.getByText('Ok', { exact: true }).click();
  }

  // ===== TOAST VERIFIERS =====
  async verifySaveToast() {
    await this.page.getByText('Qualification has been saved successful ly.', { exact: true }).waitFor();
  }


  async fillTrainerMatrixForm(data) {
    await this.competencyInput.fill(data.competency);
    await this.equivalentCompetencyInput.fill(data.equivalentCompetency);
    await this.qualificationSelect.selectOption(data.utm_utq_id);
    await this.workExpSelect.selectOption(data.utm_utwe_id);
    await this.commentsTextArea.fill(data.comments);
  }

  async saveMatrix() {
    await this.saveButton.click();
  }

  async verifySaveSuccess() {
    await expect(this.page.getByText(/A total of \d+ record\(s\) have/)).toBeVisible();
  }
  // 🔥 NEW: Delete Trainer Matrix Record
  async deleteFirstTrainerMatrix() {
    
    await this.deleteIcon.first().click();
   await this.page.getByText('Ok', { exact: true }).click();
  }
    async verifyDeleteSuccess() {
    await expect(this.page.getByText('Trainer matrix has been deleted successfully.')).toBeVisible();
  }
  async verifyDeleteToast() {
    await this.page.getByText('Qualification has been deleted successfully.', { exact: true }).waitFor();
  }
  async navigateToMatrix() {
      await this.trainerMatrixLink.click();
    
  }

}

module.exports = { DashboardPage };
