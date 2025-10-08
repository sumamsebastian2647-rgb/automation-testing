// pages/UserManagementPage.js
const { expect } = require('@playwright/test');

class UserManagementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    this.firstNameSearch = page.locator('input[name="UserByRtoSearch[ubr_firstname]"]');
    this.okButton = page.getByText('Ok', { exact: true });
    this.showInactiveLink = page.locator('a.btn-warning:has-text("Show Inactive Admins")');
    this.modalOkButton = page.locator('.bootstrap-dialog-footer .btn-warning:has-text("Ok")');
      this.noResults = page.locator('table tbody .empty');
  }

  async navigate() {
    await this.userManagementLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchUser(firstName) {
    await this.firstNameSearch.fill(firstName);
    await this.firstNameSearch.press('Enter');
    await this.page.waitForTimeout(500); // allow table to refresh
  }

 
  async inactivateUser(fullName) {
    await this.searchUser(fullName); 
    const row = this.page.locator('table tbody tr', { hasText: fullName }).first();
    // Click the deactivate icon in that row
    await row.locator('a[title="Deactivate"]').click();
     // Wait for modal and click OK
    await this.modalOkButton.waitFor({ state: 'visible' });
    await this.modalOkButton.click();
    await expect(this.page.locator('text=User successfully inactivated.')).toBeVisible({
      timeout: 5000,
    });
     await this.searchUser(fullName); 
      if (await this.noResults.isVisible()) {
      console.log(`⚠️ User "${fullName}" not found in active list. User is inactivated successfully`);
      return;
    }
  }

  async reactivateUser(fullName) {
    await this.showInactiveLink.click();
    console.log('clciked inactive link menu');
     await this.page.waitForLoadState('networkidle');
    await this.searchUser(fullName);
   const row = this.page.locator('table tbody tr', { hasText: fullName }).first();
    // Click the deactivate icon in that row
     await row.locator('a[title="Reactivate"]').click();
     // Wait for modal and click OK
    await this.modalOkButton.waitFor({ state: 'visible' });
    await this.modalOkButton.click();
    await expect(this.page.locator('text=User successfully activated.')).toBeVisible({
      timeout: 5000,
    });
     await this.searchUser(fullName); 
      if (await this.noResults.isVisible()) {
      console.log(`⚠️ User "${fullName}" not found in active list. User is inactivated successfully`);
      return;
    }
   
  }
}

module.exports = { UserManagementPage };
