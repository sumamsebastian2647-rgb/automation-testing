// pages/DashboardPage.js
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // Menus / navigation
    this.formsMenu = page.locator('#forms > a');
    this.enrolmentForms = page.locator('a[href="/master-forms/index"]');
    this.createTemplate = page.getByRole('link', { name: /Create Form Template/i });
    this.domesticForm = page.getByRole('link', { name: /Domestic Form/i });

    // Field types
    this.FIELD_TYPES = [
      'text',
      'textarea',
      'number',
      'email',
      'date',
      'dropdown',
      'radio',
      'checkbox',
      'file'
    ];

    // Form sections (from data-section attribute)
   this.SECTION_UI = {
  residential: { heading: 'headingTwo', collapse: 'collapseTwo' },
  contact: { heading: 'headingThree', collapse: 'collapseThree' },
  employer: { heading: 'headingThirteen', collapse: 'collapseThirteen' },
  preCourse: { heading: 'headingFive', collapse: 'collapseFive' },
  rpl: { heading: 'headingSix', collapse: 'collapseSix' },
  //studentIdentifier: { heading: 'headingSeven', collapse: 'collapseSeven' },
  //identification: { heading: 'headingNine', collapse: 'collapseNine' },
  ///declaration: { heading: 'headingTen', collapse: 'collapseTen' }
};
this.FORM_SECTIONS = {
  residential: 'residential_information',
  contact: 'contact_information',
  employer: 'employer_information',
  preCourse: 'pre_course_evaluation',
  rpl: 'prior_learning',
  //studentIdentifier: 'student_identifier',
  //identification: 'identification',
  //declaration: 'declaration_signature'
};
  }

  /* ---------- Navigation ---------- */

  async navigate() {
    await this.formsMenu.click();
    await this.page.waitForLoadState('networkidle');
    await this.enrolmentForms.click();
    await this.page.waitForLoadState('networkidle');
  }
async openDomesticFormTemplate() {
    await this.createTemplate.click();
    await this.domesticForm.click();
}
async  openFormInformationSection() {
  const heading = this.page.locator('#headingOne');
  // Click only if collapsed
  const isExpanded = await heading.getAttribute('aria-expanded');
  if (isExpanded === 'false') {
    await heading.click();
  }
  // Wait until form name input is visible
  await this.page.waitForSelector('#txtFormName', { state: 'visible' });
}
async fillFormInformation( formData) {
  // Form Name
  await this.page.fill('#txtFormName', formData.formName);
  // Logo upload
  await this.page.setInputFiles('#rtoLogo', formData.logo);
 const titleEditor = this.page.locator('.redactor-editor').first();
    await titleEditor.click();
    await titleEditor.press('Control+A');
    await titleEditor.type(formData.formName, { delay: 30 });
// 🔑 Force blur so Redactor syncs value
await this.page.keyboard.press('Tab');
 const enrolmentEditor = this.page.locator('.redactor-editor').nth(2);

await enrolmentEditor.fill(formData.enrolmentInstruction);
  // Course Instruction radio → No (value="0")
  await this.page.check('input[name="rdoShowCourseDescription"][value="0"]');
}
async  saveFormLayout() {
  await this.page.click('#btnSave');

  // wait for success toast (adjust selector/text if needed)
  await this.page.waitForSelector('.toast-success, .alert-success', {
    timeout: 10000
  });
}

  async searchByFormName(name) {
    const input = this.page.locator('input[name="MasterFormsSearch[form_name]"]');
    await input.fill(name);
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async editFirstForm() {
    const firstRow = this.page.locator('table tbody tr').first();
    const editButton = firstRow.locator('a[title="update"]');
    await Promise.all([
      this.page.waitForURL('**/updateenrollmentform*'),
      editButton.click()
    ]);
  }
async generateLinkFromFirstRow() {
  const firstRow = this.page.locator('table tbody tr').first();
  const generateLinkBtn = firstRow.locator('button[title="Generate Link"]');
    // Close any existing modals first
  try {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  } catch (error) {
    // Ignore if no modals to close
  }
    await generateLinkBtn.click();
  // Add delay after clicking generate link button
  await this.page.waitForTimeout(2000);
  // Wait for any modal to appear, then get the last one (most recent)
  await this.page.waitForSelector('#generate-link', { state: 'visible', timeout: 10000 });
    // Get all visible modals and use the last one
  const modals = await this.page.locator('#generate-link').all();
  const modal = this.page.locator('#generate-link').last();
    console.log(`Found ${modals.length} modals, using the last one`);
  // Wait a bit more for modal to fully load
  await this.page.waitForTimeout(1000);
  // Select first course - click on the Select2 dropdown
  await modal.locator('#select2-dropdownCourse-container').click();
  await this.page.waitForTimeout(1500);
  // Select the first course option (index 0 for first actual course)
  await this.page.locator('.select2-results__option').nth(1).click();
  await this.page.waitForTimeout(1000);
  // Generate link - add delay before clicking
  await this.page.waitForTimeout(500);
  await modal.locator('#btnGenerateLink').click();
  // Wait for the input group to become visible (contains the generated link)
  await modal.locator('#input-group').waitFor({ state: 'visible', timeout: 15000 });
  // Get the generated URL
  const url = await modal.locator('#generatedlink').inputValue();
  console.log('Generated link:', url);
  // Copy the link to clipboard
  await modal.locator('#copylink').click();
  console.log('Link copied to clipboard');
  // Add delay before closing
  await this.page.waitForTimeout(1000);
  // Close ALL modals to prevent duplicates
  try {
    // Close all generate-link modals
    const allModals = await this.page.locator('#generate-link').all();
    for (const modalElement of allModals) {
      try {
        await modalElement.locator('button.close').click();
      } catch (error) {
        // Continue if close button doesn't work
      }
    }
        // Also try pressing Escape multiple times
    await this.page.keyboard.press('Escape');
    await this.page.keyboard.press('Escape');
      } catch (error) {
    console.log('Error closing modals:', error.message);
  }

  return url;
}

  async openSection(sectionKey) {
    const section = this.SECTION_UI[sectionKey];
    if (!section) {
      throw new Error(`Unknown section key: ${sectionKey}`);
    }
    const heading = this.page.locator(`#${section.heading}`);
    if (await heading.getAttribute('aria-expanded') === 'false') {
      await heading.click();
    }
    await this.page.locator(`#${section.collapse}`).waitFor({ state: 'visible' });
  }
   /* ---------- Utilities ---------- */

  generateUnique(prefix) {
    return `${prefix.toLowerCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  /* ---------- Custom Field Logic ---------- */

  async addCustomField(formSection, fieldType) {
  const fieldName = this.generateUnique('field_name');
  const fieldLabel = this.generateUnique('field_label');

  const addCustomFieldBtn = this.page.locator(
    `button.add-custom-field-btn[data-section="${formSection}"]`
  );

  // 🔑 1. Ensure button is visible BEFORE clicking
  await addCustomFieldBtn.scrollIntoViewIfNeeded();
  await addCustomFieldBtn.click();

  await this.page.getByRole('textbox', { name: 'Field Name *' }).fill(fieldName);
  await this.page.getByRole('textbox', { name: 'Field Label *' }).fill(fieldLabel);
  await this.page.locator('#fieldType').selectOption(fieldType);

  if (['dropdown', 'radio', 'checkbox'].includes(fieldType)) {
    await this.page.locator('#fieldOptions')
      .fill('Option 1, Option 2, Option 3');
  }

  await this.page.getByRole('button', { name: 'Save Field' }).click();

  // 🔑 2. Wait for success modal
  const okBtn = this.page.getByRole('button', { name: 'OK' });
  await okBtn.waitFor({ state: 'visible' });
  await okBtn.click();

  // 🔑 3. RESTORE SCROLL (THIS IS THE KEY FIX)
  await addCustomFieldBtn.scrollIntoViewIfNeeded();

  // 🔑 4. Restore body scroll (Bootstrap bug fix)
  await this.page.evaluate(() => {
    document.body.style.overflow = 'auto';
  });

  return { formSection, fieldName, fieldLabel, fieldType };
}

  async addAllCustomFieldsToSection(formSection) {
    const createdFields = [];
    for (const type of this.FIELD_TYPES) {
      const field = await this.addCustomField(formSection, type);
      createdFields.push(field);
    }
    return createdFields;
  }
}

module.exports = { DashboardPage };
