// Pages/DashboardPage.js
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // --- NAVIGATION (UNCHANGED AS YOU ASKED) ---
    this.courseManagementMenu = page.locator('#course_management > a'); 
    this.courselist = page.locator( '#course_management ul.treeview-menu a[href="/course/index"]' );

    // --- SEARCH FILTERS (UPDATED using getByLabel) ---
    this.categorySelect = page.getByLabel('Category');
    this.codeInput = page.getByLabel('Code');
    this.nameInput = page.getByLabel('Name');
    this.typeSelect = page.getByLabel('Type');
    this.priceInput = page.getByLabel('Price (AUD)');

    // Buttons
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('link', { name: 'Reset' });
    this.backBtn = page.getByRole('link', { name: 'Back' }).first();

    // Create / Active / Inactive / Actions
    this.createButton = page.getByRole('link', { name: 'Create Course Category' });
    this.showInactiveLink = page.getByRole('link', { name: 'Show Inactive Course Categories' });
    this.showActiveLink = page.getByRole('link', { name: 'Show Active Course Categories' });

    this.inactivateButton = page.locator('a[title="inactivate"]');
    this.reactivateButton = page.locator('a[title="activate"]');
    this.okButton = page.getByRole('button', { name: 'Ok' });

    this.paginationLinks = page.locator('ul.pagination li a');

    // Results
    this.courseCategoryLinkByName = (name) =>
      page.getByRole('link', { name, exact: true });
  }
// ------------------------------------------------- 
// NAVIGATION
// -------------------------------------------------
async navigateToCourseCategory() {
  console.log('📂 Navigating to Course Category...');

  await this.page.waitForSelector('#course_management', { timeout: 20000 });
  const courseManagementContainer = this.page.locator('#course_management');

  await expect(this.courseManagementMenu).toBeVisible({ timeout: 15000 });

  for (let attempt = 1; attempt <= 2; attempt++) {
    const menuExpanded = await courseManagementContainer.evaluate(el =>
      el.classList.contains('menu-open')
    );

    if (menuExpanded) break;

    await this.courseManagementMenu.scrollIntoViewIfNeeded();
    await this.courseManagementMenu.click({ force: true });
    await this.page.waitForTimeout(800);

    const nowExpanded = await courseManagementContainer.evaluate(el =>
      el.classList.contains('menu-open')
    );

    if (nowExpanded) break;

    if (attempt === 2)
      throw new Error('❌ Failed to expand Course Management menu.');
  }

  await this.page.waitForFunction(() => {
    const el = document.querySelector(
      '#course_management ul.treeview-menu a[href="/course/index"]'
    );
    return el && el.offsetParent !== null;
  }, { timeout: 10000 });
  await this.courselist.scrollIntoViewIfNeeded();
  await this.courselist.click({ force: true });
  await this.page.waitForURL(/course\/index/, { timeout: 10000 });
  console.log('✅ Successfully navigated to Course page!');
}


  // -------------------------------------------------
  // SEARCH FUNCTIONS (UPDATED)
  // -------------------------------------------------

  async searchByCategory(value) {
    await this.categorySelect.selectOption(value);
    await this.searchBtn.click();
  }

  async searchByCode(code) {
    await this.codeInput.fill(code);
    await this.searchBtn.click();
  }

  async searchByName(name) {
    await this.nameInput.fill(name);
    await this.searchBtn.click();
  }

  async searchByType(value) {
    await this.typeSelect.selectOption(value);
    await this.searchBtn.click();
  }

  async searchByPrice(price) {
    await this.priceInput.fill(price);
    await this.searchBtn.click();
  }

  // -------------------------------------------------
  // RESULT ACTIONS
  // -------------------------------------------------

  async openCategory(name) {
    await this.courseCategoryLinkByName(name).click();
  }
  async verifyCourseByCode(courseCode) {
      // Course code usually appears in the course card (adjust selector if needed)
      const matches = await this.page
        .locator('.box')
        .filter({ hasText: courseCode })
        .count();
      if (matches > 0) {
        console.log(`✅ Course Code "${courseCode}" found (${matches} match/es)`);
        return true;
      } else {
        console.log(`❌ Course Code "${courseCode}" NOT found`);
        return false;
      }
  }
  async verifyCourseByName(courseName) {
      const matches = await this.page
        .locator('.box')                 // course cards wrapper
        .filter({ hasText: courseName }) // match the name
        .count();
      if (matches > 0) {
        console.log(`✅ Course name "${courseName}" found (${matches} matches)`);
        return true;
      } else {
        console.log(`❌ Course name "${courseName}" NOT found`);
        return false;
      }
  }
  async openCourseByType(courseName) {
    const course = this.page
      .locator('.box .label.label-info')
      .filter({ hasText: courseName })
      .first();
    const exists = await course.count();
    if (!exists) {
      throw new Error(`❌ Course "${courseName}" not found after filtering by type`);
    }
    console.log(`📂 Opening course: ${courseName}`);
    await course.click();
    await this.page.waitForLoadState('networkidle');
  }
  async reset() {
    await this.resetBtn.click();
  }

  async clickBack() {
    await this.backBtn.click();
  }
}

module.exports = { DashboardPage };
