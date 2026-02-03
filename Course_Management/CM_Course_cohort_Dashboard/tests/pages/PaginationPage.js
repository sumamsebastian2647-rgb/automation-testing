// pages/PaginationPage.js
const { expect } = require('@playwright/test');

class PaginationPage {
  constructor(page) {
    this.page = page;

    // Scope pagination locators
    this.pagination = page.locator('ul.pagination');
    this.prevButton = this.pagination.locator('li.prev');
    this.nextButton = this.pagination.locator('li.next');
    this.activePage = this.pagination.locator('li.active a');

    // Helper to select any page number
    this.pageNumber = (num) => this.pagination.locator(`li >> a:has-text("${num}")`);
  }

  async navigateToPage1() {
    await this.page.goto('/course-class/index');
    await expect(this.pagination).toBeVisible();
    await expect(this.page).toHaveURL(/\/course-class\/index(\?page=1)?$/);
  }

  async clickPage(num) {
    const pageLink = this.pageNumber(num);
    await expect(pageLink).toBeVisible(); // ensures locator exists
    await pageLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickNext() {
    const nextLink = this.nextButton.locator('a');
    if (await nextLink.count() > 0) {
      await nextLink.click();
      await this.page.waitForLoadState('networkidle');
    } else {
      console.log('Next button is disabled. Cannot click.');
    }
  }

  async clickPrev() {
    const prevLink = this.prevButton.locator('a');
    if (await prevLink.count() > 0) {
      await prevLink.click();
      await this.page.waitForLoadState('networkidle');
    } else {
      console.log('Prev button is disabled. Cannot click.');
    }
  }

  async verifyActivePage(num) {
    await expect(this.activePage).toHaveText(String(num));
  }

  async verifyPrevDisabled() {
    await expect(this.prevButton).toHaveClass(/disabled/);
  }

  async verifyPrevEnabled() {
    await expect(this.prevButton).not.toHaveClass(/disabled/);
  }

  async verifyNextExists() {
    // Only checks if li.next is visible (enabled or disabled)
    await expect(this.nextButton).toBeVisible();
  }
}

module.exports = { PaginationPage };
