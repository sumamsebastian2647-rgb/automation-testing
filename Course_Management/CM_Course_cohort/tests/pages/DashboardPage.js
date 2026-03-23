const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // NAVIGATION
    this.courseManagementMenu = page.locator('#course_management > a');
    this.courseCohortLink = page.locator('a[href="/course-class/index"]');
    this.createCohortBtn = page.locator('a.btn.btn-success.btn-flat.pull-right', {hasText: 'Create Cohort'});
    // Locators
    this.trainerSearchBox = page.getByRole('searchbox', { name: 'Select Trainer' });
    this.courseDropdown = page.locator('#select2-courseclass-class_course_id-container');
    this.courseSearchBox = page.getByRole('searchbox').nth(1);
    this.cohortNameInput = page.getByRole('textbox', { name: 'Cohort Name*' });
    this.cohortLocationInput = page.getByRole('textbox', { name: 'Cohort Location*' });
    this.startDateInput = page.locator('#courseclass-start_date');
    this.endDateInput = page.locator('#courseclass-end_date');
    this.saveButton = page.locator('form#' + 'w0').locator('div.box-footer > button.btn-success');
    this.backButton = page.locator('a.btn-google', { hasText: 'Back' });
     this.cohortNameBox = page.getByRole('textbox', { name: 'Cohort Name' });
     this.searchBtn = page.getByRole('button', { name: 'Search' });
  }
  // -----------------------------------------
  // NAVIGATION
  // -----------------------------------------
 async navigateToCourseCohort() {
        const menu = this.page.locator('#course_management > a');
        const submenu = this.page.locator('a[href="/course-class/index"]');
        // 1️⃣ Wait for sidebar menu
        await this.page.waitForSelector('#course_management', { timeout: 20000 });
        // 2️⃣ Ensure menu is expanded (repeat until "menu-open" exists)
        for (let i = 0; i < 5; i++) {
            const isOpen = await this.page.locator('#course_management')
                .evaluate(el => el.classList.contains('menu-open'))
                .catch(() => false);
            if (isOpen) break;
            await menu.click({ force: true });
            await this.page.waitForTimeout(400);
        }
        // 3️⃣ Wait for submenu to appear & be visible
        await submenu.waitFor({
            state: 'visible',
            timeout: 15000
        });
        // 4️⃣ Click the submenu
        await submenu.click({ trial: true }).catch(() => {}); // Check visibility without failing
        await submenu.click({ force: true });
        // 5️⃣ Confirm navigation
        await this.page.waitForURL(/course-class\/index/, { timeout: 15000 });
  }
  async clickCreateCohort() {
      await this.createCohortBtn.click();
  }

  async selectTrainer(trainerName) {
        await this.trainerSearchBox.click();
        await this.trainerSearchBox.fill(trainerName);
        await this.trainerSearchBox.press('Enter');
  }
  async selectCourse(courseName) {
        await this.courseDropdown.click();
        await this.courseSearchBox.fill(courseName);
        await this.page.getByRole('option', { name: courseName }).click();
  }

  async fillCohortDetails({ name, location, startDate, endDate }) {
        await this.cohortNameInput.fill(name);
        await this.cohortLocationInput.fill(location);
        if (startDate) {
            await this.startDateInput.fill(startDate);
        }
        if (endDate) {
            await this.endDateInput.fill(endDate);
        }
  }
  async fillCohort_name(name) {
        await this.cohortNameInput.fill(name);
       
  }
 async fillCohort_location(location) {
        await this.cohortLocationInput.fill(location);
       
  }

  async clickSave() {
        await this.saveButton.click();
        console.log('Save button clicked.');
  }

  async clickBack() {
        await this.backButton.click();
        console.log('Back button clicked.');
  }

  async createCohort(trainer, course, cohortDetails) {
        await this.selectTrainer(trainer);
        await this.selectCourse(course);
        await this.fillCohortDetails(cohortDetails);
        await this.clickSave();
  }
  async searchCohortByName(name) {
    await this.cohortNameBox.click();
    await this.cohortNameBox.fill(name);
    await this.cohortNameBox.press('Enter');
    await this.searchBtn.click();
    await this.page.getByRole('link', { name: name, exact: false }).click();
  }
  async expectErrorMessage(message) {
        await expect(this.page.getByText(message)).toBeVisible();
  }
  async cohortselect() {
    const firstCourseCard = this.page.locator('.box-body img.course_image').first();
    await expect(firstCourseCard).toBeVisible({ timeout: 60000 });
    await firstCourseCard.click();
  
  }
}

module.exports = { DashboardPage };
