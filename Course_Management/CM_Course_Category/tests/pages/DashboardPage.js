// Pages/DashboardPage.js
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // --- NAVIGATION ---
    this.courseManagementMenu = page.locator('#course_management > a');
    this.courseCategoryLink = page.locator(
      '#course_management ul.treeview-menu a[href="/course-categories/index"]'
    );

    // --- COURSE CATEGORY PAGE ELEMENTS ---
    this.createButton = page.getByRole('link', { name: 'Create Course Category' });
    this.categoryNameInput = page.getByRole('textbox', { name: 'Category Name*' });
    this.saveButton = page.getByRole('form').getByRole('button');
    this.successToast = page.getByText(/Course category has been/i);
    this.errorMessage = page.getByText('Category Name cannot be blank.');
    this.searchInput = page.locator('input[name="CourseCategoriesSearch[cat_name]"]');
    this.categorySortLink = page.locator('a.kv-sort-link', { hasText: 'Category Name' });
    this.createdSortLink = page.locator('a.kv-sort-link', { hasText: 'Created At' });
    this.categoryNameCells = page.locator('table tbody tr td:nth-child(2)');

    // Common buttons
    this.backButton = page.getByRole('link', { name: 'Back' });
    this.updateButton = page.getByRole('link', { name: 'Update' });

    this.viewIcon = page.getByRole('link', { name: '' }).first();
    this.breadcrumb = page.locator('.breadcrumb');
    this.updateIcon = this.page.locator('tr.w0:first-child a[title="update"]');
    this.heading = this.page.getByRole('heading', { name: /UPDATE COURSE CATEGORY/i });

    // 🔹 Dynamic Table Helpers
    this.firstRow = () => this.page.locator('table tbody tr').first();
    this.firstRowViewIcon = () => this.firstRow().locator('a[title="view"]');
    this.firstRowUpdateIcon = () => this.firstRow().locator('a[title="update"]');
    this.pageHeader = page.locator('section.content-header h1');
    this.firstRowCategoryNameCell = () => this.firstRow().locator('td').nth(1);
    this.firstRowCreatedDateCell = () => this.firstRow().locator('td').nth(2);

    // Common locators
    this.searchInput = page.locator('input[name="CourseCategoriesSearch[cat_name]"]');
    this.showInactiveLink = page.locator('a.btn-warning', { hasText: 'Show Inactive Course Categories' });
    this.showInactiveButton = page.locator('a.btn.btn-warning.btn-flat.pull-right.margin-right-one', { hasText: 'Show Inactive Course Categories' });
    this.categoryTable = page.locator('table tbody');
    this.showActiveLink = page.getByRole('link', { name: 'Show Active Course Categories' });
    this.reactivateButton = page.locator('a[title="activate"]');
    this.noResultsText = page.getByText('No results found.');
    this.okButton = page.locator('.bootstrap-dialog-footer button.btn-warning:has-text("Ok")');
    this.paginationLinks = page.locator('ul.pagination li a');
  }

  // -------------------------------------------------
  // ✅ ADDED MISSING FUNCTION (DO NOT REMOVE)
  // -------------------------------------------------
  async waitForLoadingToFinish() {
    // Loader variations used by Yii2 / AdminLTE apps
    const loaders = [
      '.kv-loader',                // grid view loader
      '.loading',                  // generic app loader
      '.overlay',                  // adminLTE overlay
      '.preloader',                // preloader
      '.ajax-loader',              // ajax loader
    ];

    for (const selector of loaders) {
      const loader = this.page.locator(selector);
      if (await loader.count()) {
        await loader.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      }
    }

    // Ensure AJAX done
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(300); // UI buffer
  }
  // -------------------------------------------------


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

      if (attempt === 2) throw new Error('❌ Failed to expand Course Management menu.');
    }

    await this.page.waitForFunction(() => {
      const el = document.querySelector(
        '#course_management ul.treeview-menu a[href="/course-categories/index"]'
      );
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });

    await this.courseCategoryLink.scrollIntoViewIfNeeded();
    await this.courseCategoryLink.click({ force: true });
    await this.page.waitForURL(/course-categories\/index/, { timeout: 10000 });

    console.log('✅ Successfully navigated to Course Category page!');
  }

  // -------------------------------------------------
  // Show Inactive Categories
  // -------------------------------------------------
  async clickShowInactiveCategories() {
    console.log('➡️ Clicking "Show Inactive Course Categories"...');

    await this.showInactiveButton.waitFor({ state: 'attached', timeout: 10000 });
    await this.showInactiveButton.scrollIntoViewIfNeeded();
    await this.showInactiveButton.click();

    await this.categoryTable.waitFor({ state: 'visible', timeout: 15000 });

    const pageContent = await this.page.content();
    if (pageContent.includes('Inactive') || pageContent.includes('Deleted')) {
      console.log('✅ Inactive Course Categories page displayed.');
    }
  }

  // -------------------------------------------------
  // FORM ACTIONS
  // -------------------------------------------------
  async openCreateForm() {
    await this.createButton.click();
  }

  async submitEmptyForm() {
    await this.page.locator('div.box-footer button.btn.btn-success.btn-flat').click();
  }

  async expectValidationError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async createCourseCategory(categoryName) {
    await this.categoryNameInput.fill(categoryName);
    await this.page.locator('div.box-footer button.btn.btn-success.btn-flat').click();
    await expect(this.successToast).toBeVisible();
  }

 async searchCourseCategory(categoryName) {
  await this.searchInput.fill(categoryName);
  await this.searchInput.press('Enter');

  const row = this.page.locator('table tr', { hasText: categoryName });
  await expect(row).toBeVisible({ timeout: 10000 });
}


  // -------------------------------------------------
  // VIEW / DETAILS
  // -------------------------------------------------
  async verifyViewTooltip() {
    await expect(this.firstRowViewIcon()).toHaveAttribute('title', 'view');
  }

  async viewNavigation() {
    const firstRowCategory = (await this.firstRowCategoryNameCell().innerText()).trim();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.firstRowViewIcon().click(),
    ]);
    const viewedCategoryName = (await this.page
      .locator('//th[normalize-space()="Category Name"]/following-sibling::td')
      .innerText()).trim();
    expect(viewedCategoryName).toBe(firstRowCategory);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.locator('a.btn.btn-flat.btn-google', { hasText: 'Back' }).click()
    ]);
  }

  async getFirstRowDetails() {
    await expect(this.firstRow()).toBeVisible();
    const name = (await this.firstRowCategoryNameCell().textContent()).trim();
    const date = (await this.firstRowCreatedDateCell().textContent()).trim();
    return { name, date };
  }

  async openFirstCategoryView() {
    await expect(this.firstRow()).toBeVisible();
    await this.firstRowViewIcon().click();
    await expect(this.page).toHaveURL(/course-categories\/view/);
  }

  async verifyBreadcrumb(expectedCategoryName) {
    await expect(this.breadcrumb).toBeVisible();
    const activeCrumb = this.breadcrumb.locator('li.active');
    await expect(activeCrumb).toContainText(expectedCategoryName);
  }

  async verifyCategoryDetails({ name, date }) {
    const createdRow = this.page.getByRole('row', { name: /Created by/i });
    await expect(createdRow).toContainText(date);
    const updatedRow = this.page.getByRole('row', { name: /Last Updated by/i });
    await expect(updatedRow).toContainText(date);
  }

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------
  async verifyUpdateTooltip() {
    await expect(this.firstRowUpdateIcon()).toHaveAttribute('title', 'update');
  }

  async clickUpdateIcon() {
    await this.page.waitForSelector('table tbody tr', {
      state: 'visible',
      timeout: 20000,
    });

    await this.page.waitForFunction(() => {
      return document.querySelectorAll('table tbody tr').length > 0;
    });

    const updateIcon = this.firstRowUpdateIcon();
    await expect(updateIcon).toBeVisible({ timeout: 10000 });
    await updateIcon.scrollIntoViewIfNeeded();
    await updateIcon.click({ timeout: 10000 });
  }

  async updateCourseCategory(newCategoryName) {
    await this.categoryNameInput.click({ clickCount: 3 });
    await this.page.keyboard.press('Backspace');
    await this.categoryNameInput.fill(newCategoryName);
    await this.page.locator('div.box-footer button.btn.btn-success.btn-flat').click();
  }

  // -------------------------------------------------
  // BUTTON VERIFICATION
  // -------------------------------------------------
  async verifyButtons() {
    await expect(this.backButton).toBeVisible();
    await expect(this.updateButton).toBeVisible();
  }

  async clickBackAndVerify() {
    const backButton = this.page.locator('.box-header.with-border >> a.btn-google', { hasText: 'Back' });
    await backButton.waitFor({ state: 'visible' });
    await backButton.scrollIntoViewIfNeeded();
    await backButton.click();
    await expect(this.page).toHaveURL(/course-categories\/index/);
  }

  // -------------------------------------------------
  // ACTIVATE / INACTIVATE / DELETE
  // -------------------------------------------------
  async verifyinactivateTooltip() {
    const firstInactivateBtn = this.page.locator('a.btn-danger[title="inactivate"]').first();
    await expect(firstInactivateBtn).toHaveAttribute('title', 'inactivate');
  }

  async verifyactivateTooltip() {
    const firstInactivateBtn = this.page.locator(' a.btn.btn-warning[title="activate"]').first();
    await expect(firstInactivateBtn).toHaveAttribute('title', 'activate');
  }

  async verifyDeleteTooltip() {
    const firstInactivateBtn = this.page.locator('a.btn-danger[title="Delete"]').first();
    await expect(firstInactivateBtn).toHaveAttribute('title', 'Delete');
  }

  async getFirstRowCategoryName() {
    const firstRow = this.page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();
    const nameCell = firstRow.locator('td').nth(1);
    return (await nameCell.textContent()).trim();
  }

  async searchCourseCategory_active(categoryName) {
    await this.searchInput.fill(categoryName);
    await this.searchInput.press('Enter');

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);

    const rows = this.page.locator('table tbody tr');
    const noResultsText = this.page.locator('text=No results found');

    let rowCount = await rows.count();

    if (rowCount === 0) {
      try {
        await expect(noResultsText).toBeVisible({ timeout: 5000 });
        return false;
      } catch {}
    }

    return true;
  }

  async inactivateFirstCategory() {
    const categoryName = await this.getFirstRowCategoryName();

    const firstRow = this.page.locator('table tbody tr').first();
    await firstRow.scrollIntoViewIfNeeded();

    const inactivateButton = firstRow.locator('a[title="inactivate"]').first();
    await inactivateButton.waitFor({ state: 'visible' });
    await inactivateButton.click();

    const modal = this.page.locator(
      '.modal-content:has-text("Are you sure you want to deactivate this course category?")'
    );
    await expect(modal).toBeVisible();

    const okButton = modal.locator('button', { hasText: 'OK' });
    await okButton.click();

    await this.page.waitForLoadState('networkidle');

    await this.searchCourseCategory_active(categoryName);
  }

  async searchCourseCategory_inactive(categoryName) {
    console.log(`${categoryName}`);
    await this.searchInput.fill(categoryName);
    await this.searchInput.press('Enter');

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const rows = this.page.locator('table tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      await expect(this.noResultsText).toBeVisible({ timeout: 15000 });
      console.log(`🔹 No results found for: ${categoryName}`);
    } else {
      console.log(`🔹 Search returned ${rowCount} row(s) for: ${categoryName}`);
    }
  }

  async reactivateFirstCategory() {
    const categoryName = await this.getFirstRowCategoryName();

    await this.reactivateButton.first().click();

    const modal = this.page.locator(
      '.modal-content:has-text("Are you sure you want to reactivate this course category?")'
    );
    await expect(modal).toBeVisible();

    await this.okButton.click();

    await this.page.waitForTimeout(2000);

    const showInactiveBtn = this.page.locator(
      '.box-header.with-border a.btn.btn-warning[href*="showdeleted=1"]'
    );

    await expect(showInactiveBtn).toBeVisible();
    await showInactiveBtn.scrollIntoViewIfNeeded();
    await showInactiveBtn.click();

    await this.page.waitForLoadState('networkidle');

    await this.searchCourseCategory_inactive(categoryName);

    return categoryName;
  }

  // -------------------------------------------------
  // PAGINATION
  // -------------------------------------------------
  async verifyPagination(pages = [1, 2, 3], totalItems = 153) {
    for (const pageNum of pages) {
      await this.page.getByRole('link', { name: String(pageNum) }).click();

      const startItem = (pageNum - 1) * 20 + 1;
      const endItem = Math.min(pageNum * 20, totalItems);
      const expectedText = `Showing ${startItem}-${endItem} of ${totalItems} items.`;

      const paginationText = this.page.getByText(expectedText);
      await expect(paginationText).toBeVisible();
    }
  }

  // -------------------------------------------------
  // DELETE CATEGORY
  // -------------------------------------------------
  async deleteFirstCourseCategory() {
    await this.waitForLoadingToFinish();

    const categoryName = await this.getFirstRowCategoryName();

    await this.waitForLoadingToFinish();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(300);

    const cell = this.page.getByRole('cell', { name: categoryName });

    await expect(cell).toBeVisible();
    await cell.click();

    const deleteBtn = this.page.locator(
      `a[href*="/course-categories/delete?id="][title="Delete"]`
    ).first();

    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    const confirmBtn = this.page.getByText('Ok', { exact: true });
    await confirmBtn.click();

    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingToFinish();

    const searchInput = this.page.locator('input[name="CourseCategoriesSearch[cat_name]"]');
    await searchInput.fill('');
    await searchInput.fill(categoryName);
    await searchInput.press('Enter');

    const noResults = this.page.getByText('No results found.');
    await expect(noResults).toBeVisible();

    return categoryName;
  }
  async verifySimplePagination() {
  // Check if page 2 exists before attempting navigation
  const page2Link = this.page.getByRole('link', { name: '2' });
  const hasPage2 = await page2Link.isVisible();
  
  if (!hasPage2) {
    console.log('⚠️ Only one page exists - verifying current page only');
    // Verify we're on page 1
    const page1Active = this.page.locator('li.active a[data-page="0"]');
    await expect(page1Active).toBeVisible();
    return;
  }
  
  console.log('🧭 Verifying pagination navigation: 1 → 2 → 1');
  
  // Step 1: Verify we start on page 1
  await expect(this.page.locator('li.active a[data-page="0"]')).toBeVisible();
  console.log('✅ Verified starting on page 1');
  
  // Step 2: Navigate to page 2
  await page2Link.click();
  await this.page.waitForLoadState('networkidle');
  
  // Verify we're now on page 2
  await expect(this.page.locator('li.active a[data-page="1"]')).toBeVisible();
  console.log('✅ Successfully navigated to page 2');
  
  // Step 3: Navigate back to page 1
  const page1Link = this.page.getByRole('link', { name: '1' });
  await page1Link.click();
  await this.page.waitForLoadState('networkidle');
  
  // Verify we're back on page 1
  await expect(this.page.locator('li.active a[data-page="0"]')).toBeVisible();
  console.log('✅ Successfully navigated back to page 1');
  
  console.log('✅ Pagination navigation verification completed successfully');
}


}

module.exports = { DashboardPage };
