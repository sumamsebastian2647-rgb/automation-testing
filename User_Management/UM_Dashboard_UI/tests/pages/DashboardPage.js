const { expect } = require('@playwright/test');
// Import SortUtils for sorting interactions and SortVerifier for verification
// Based on tests/pages/SortUtils.js, it exports { SortUtils }, so destructuring is correct.
const { SortUtils } = require('./SortUtils'); 

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    
    // Table selectors
    this.tableSelector = 'table';
    this.tableRowSelector = `${this.tableSelector} tbody tr`;
 const columns = [
      { name: 'Name', index: 1, type: 'text' },
      { name: 'Username', index: 2, type: 'text' },
      { name: 'Email', index: 3, type: 'text' }
    ];
    
    // Initialize SortUtils with the page and column configuration
    this.sortUtils = new SortUtils(page, columns);
  }

  async openUserManagement() {
    await this.userManagementLink.click();
    await this.page.locator(this.tableSelector).waitFor({ state: 'visible', timeout: 10000 });
  }

  async search(field, value) {
    const input = this.page.locator(`input[name="UserByRtoSearch[${field}]"]`);
    await input.fill(value);
    await input.press('Enter');
  }

  async filterByRole(role) {
    await this.page.locator('select[name="UserByRtoSearch[ubr_job_role]"]').selectOption(role);
  }

  async tableShouldContain(text) {
    await this.page.locator('table').waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.page.locator('table')).toContainText(text, { timeout: 5000 });
  }

  // Removed: getColumnValues, clickColumnHeaderForAsc, clickColumnHeaderForDesc, testColumnSorting
  // These are now handled by this.sortUtils
}

module.exports = { DashboardPage };
