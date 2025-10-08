
const { expect } = require('@playwright/test');

class VerifyPagination {
  constructor(page) {
    this.page = page;
    this.userMgmtLink = page.getByRole('link', { name: ' User Management' });
    this.pageSizeBtn = page.getByRole('button', { name: /|Apply/ });
    this.pageSizeInput = page.getByRole('textbox', { name: 'Page Size' });
    this.applyBtn = page.getByRole('button', { name: / Apply|Apply/ });
    this.gridContainer = page.locator('#user-by-rto-grid-container');
  }

  // 🧭 Navigate to User Management section
  async navigateToUserManagement() {
    await this.userMgmtLink.click();
    await this.page.waitForSelector('#user-by-rto-grid-container');
    console.log('🧭 Navigated to User Management');
  }
// 🏁 Navigate to a specific page by number
async goToPage(pageNumber) {
  await this.page.getByRole('link', { name: String(pageNumber), exact: true }).click();
  // Wait for the grid to update
  await expect(this.gridContainer.locator('table tbody tr:first-child td:first-child')).toBeVisible();
  console.log(`➡️ Navigated to Page ${pageNumber}`);
  await this.page.waitForTimeout(20000);
}
  // 📄 Set page size and confirm
  async setPageSize(size) {
    await this.pageSizeBtn.click();
    await this.pageSizeInput.fill(String(size));
    await this.applyBtn.click();
    await expect(this.page.getByText(new RegExp(`Showing 1-${size} of`))).toBeVisible();
    console.log(`📄 Page size set to ${size}`);
  }

 async verifyPagination() {
  // Page 1 - first cell
  const firstCellPage1 = await this.gridContainer
    .locator('table tbody tr:first-child td:first-child')
    .innerText();
  console.log('📄 Page 1 first cell:', firstCellPage1);

  // Go to Page 2
  await this.page.getByRole('link', { name: '2', exact: true }).click();

// Navigate to Page 2
await Promise.all([
  this.page.waitForResponse(resp =>
    resp.url().includes('user-by-rto') && resp.status() === 200
  ),
  this.page.getByRole('link', { name: '2', exact: true }).click(),
]);

// Wait for table to load
await this.page.waitForSelector('#user-by-rto-grid-container table tbody tr:first-child td:first-child');

// Capture Page 2 first cell
const firstCellPage2 = await this.gridContainer
  .locator('table tbody tr:first-child td:first-child')
  .innerText();
console.log('📄 Page 2 first cell:', firstCellPage2);

  // Compare
  expect(firstCellPage1).not.toBe(firstCellPage2);
  console.log('✅ Pagination (Page 1 ↔ Page 2) verified successfully');

  // Go to next page using ›
  const nextButton = this.page.getByRole('link', { name: '»' });
  if (await nextButton.isVisible()) {
    await nextButton.click();
    console.log('➡️ Moved to next page');
  }

  // Go to previous page using ‹
  const prevButton = this.page.getByRole('link', { name: '«' });
  if (await prevButton.isVisible()) {
    await prevButton.click();
    console.log('⬅️ Returned to previous page');
  }

  // Optional: navigate back to Page 1 (if you have a helper)
  // await this.goToPage(1);
  // console.log('🔁 Returned to Page 1');
}


}

module.exports = { VerifyPagination };
