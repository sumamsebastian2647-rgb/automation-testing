const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // NAVIGATION
    this.courseManagementMenu = page.locator('#course_management > a');
    this.courseCohortLink = page.locator('a[href="/course-class/index"]');
    // Student
    this.studentSearchBox = page.getByRole('searchbox', { name: 'Select Student' });
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.studentsTab = page.getByText('Students', { exact: true }).first();
    // Trainer
    this.trainerSearchBox = page.getByRole('searchbox', { name: 'Select Trainer' });
    // Course
    this.courseDropdown = page.getByLabel('Select course');
    this.courseSearchBox = page.getByRole('searchbox').nth(2);
    // Cohort
    this.cohortNameBox = page.getByRole('textbox', { name: 'Cohort Name' });
    this.cohortLocationBox = page.getByRole('textbox', { name: 'Cohort Location' });
    this.showInactiveBtn = page.locator('a.btn.btn-warning.btn-flat.pull-right.margin-right-half', {
      hasText: 'Show Inactive Cohorts'
    });

    this.createCohortBtn = page.locator('a.btn.btn-success.btn-flat.pull-right', {
      hasText: 'Create Cohort'
    });
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


    // Usage
    async searchStudent(studentName) {
      await this.studentSearchBox.click();
      await this.studentSearchBox.fill(studentName);
      await this.page.getByRole('option', { name: studentName }).click();
      await this.searchBtn.click(); 
        // Target the image inside the box-body section
      await this.page.locator('.box-body img.course_image').first().click({ timeout: 60000 });
      await this.page.waitForTimeout(1000);
        // 5. Now search inside the table by name
      await this.page.locator('input[name="CourseClassSearch[name]"]').first().type(studentName);
      await this.page.locator('input[name="CourseClassSearch[name]"]').first().press('Enter');
      // 6. Call the method using this.checkStudentExists instead
      const studentExists = await this.checkStudentExists(studentName);
      console.log(`Student exists: ${studentExists}`);
    }

    async checkStudentExists(studentName) {
      // Fix: Use this.page instead of page
      const nameCell = this.page.locator(`td a:has-text("${studentName}")`);
      return await nameCell.count() > 0;
    }
    
  async selectTrainer(trainerName) {
    await this.trainerSearchBox.click();
    await this.trainerSearchBox.fill(trainerName);
    await this.trainerSearchBox.press('Enter');
   await this.page.locator(`a:has-text("${trainerName}")`).first().click();
 
  }

  async searchCourse( carbonCourse) {
    await this.courseDropdown.getByText('Select course').click();
    
    await this.courseSearchBox.fill(carbonCourse);
    await this.page.getByRole('option', { name: carbonCourse }).click();
    await this.searchBtn.click();
    await this.page.locator(`a:has-text("Carbon Farming")`).first().click();
  }

  async searchCohortByName(name) {
    await this.cohortNameBox.click();
    await this.cohortNameBox.fill(name);
    await this.cohortNameBox.press('Enter');
    await this.searchBtn.click();
    await this.page.getByRole('link', { name: name, exact: false }).click();
  }

  async searchCohortByLocation(location) {
  // 1. Enter location & search
  await this.cohortLocationBox.fill(location);
  await this.searchBtn.click();
  // 2. Wait for results to appear
  const firstCourseCard = this.page.locator('.box-body img.course_image').first();
  await expect(firstCourseCard).toBeVisible({ timeout: 60000 });
  // 3. Open first cohort card
  await firstCourseCard.click();
  // 4. Verify cohort location on the details page
  const locationCell = this.page.locator(
    'tr:has(th:has-text("Cohort Location")) >> td'
  );

  await expect(locationCell).toHaveText(location);
}

  async clickBack() {
    await this.page.getByRole('link', { name: 'Back' }).click();
  }
   async clickShowInactive() {
    await this.showInactiveBtn.click();
  }

  async clickCreateCohort() {
    await this.createCohortBtn.click();
  }
}

module.exports = { DashboardPage };
