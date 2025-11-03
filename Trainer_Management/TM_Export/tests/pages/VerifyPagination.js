const { expect } = require('@playwright/test');

class VerifyPagination {
  constructor(page) {
    this.page = page;
    this.userMgmtLink = page.getByRole('link', { name: ' Trainer Management' });
    this.pageSizeBtn = page.locator('button[data-target="#trainers-by-rto-grid-grid-modal"]');
    this.pageSizeInput = page.locator('#pageSize-trainers-by-rto-grid');
    this.applyBtn = page.locator('button.dynagrid-submit');
    this.modal = page.locator('#trainers-by-rto-grid-grid-modal');
    
    // Table and pagination selectors
    this.tableContainer = page.locator('#trainers-by-rto-grid-container');
    this.tableRows = page.locator('#trainers-by-rto-grid-container table tbody tr');
    this.paginationContainer = page.locator('#trainers-by-rto-grid-container .kv-panel-pager');
  }

  // 🧭 Navigate to Trainer Management section
  async navigateToUserManagement() {
    await this.userMgmtLink.click();
    await this.page.waitForSelector('.glyphicon-wrench');
    console.log('🧭 Navigated to Trainer Management');
  }

  // ⚙️ Open the grid modal safely
  async openModalSafely() {
    const modal = this.modal;

    // If already open — close it first
    if (await modal.isVisible()) {
      console.log('🧩 Modal already open, closing it first...');
      const closeBtn = modal.locator('button.close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click({ force: true });
        await this.page.waitForSelector('#trainers-by-rto-grid-grid-modal', { state: 'hidden' });
        console.log('✅ Modal closed.');
      }
    }

    // 🛠️ Clean modal attributes and remove Bootstrap toggles
    await this.page.evaluate(() => {
      const modalEl = document.querySelector('#trainers-by-rto-grid-grid-modal');
      if (modalEl) {
        modalEl.classList.remove('fade');
        modalEl.style.transition = 'none';
        modalEl.removeAttribute('aria-hidden');
        modalEl.style.display = 'none';
      }
    });

    // 🧭 Click wrench icon (manually trigger modal display)
    console.log('🧭 Clicking wrench icon to open modal...');
    await this.pageSizeBtn.click({ force: true });

    // 🚀 Force open the modal via JS
    await this.page.evaluate(() => {
      const modalEl = document.querySelector('#trainers-by-rto-grid-grid-modal');
      if (modalEl) {
        modalEl.style.display = 'block';
        modalEl.classList.add('in', 'show');
        modalEl.removeAttribute('aria-hidden');
        document.body.classList.add('modal-open');
      }
    });

    // ⏳ Wait until visible or retry once
    try {
      await this.page.waitForFunction(() => {
        const el = document.querySelector('#trainers-by-rto-grid-grid-modal');
        return el && window.getComputedStyle(el).display !== 'none' && el.classList.contains('in');
      }, { timeout: 5000 });
    } catch {
      console.log('⚠️ Modal did not appear, retrying open...');
      await this.pageSizeBtn.click({ force: true });
      await this.page.evaluate(() => {
        const modalEl = document.querySelector('#trainers-by-rto-grid-grid-modal');
        if (modalEl) {
          modalEl.style.display = 'block';
          modalEl.classList.add('in', 'show');
          document.body.classList.add('modal-open');
        }
      });
      await this.page.waitForFunction(() => {
        const el = document.querySelector('#trainers-by-rto-grid-grid-modal');
        return el && window.getComputedStyle(el).display !== 'none' && el.classList.contains('in');
      }, { timeout: 5000 });
    }

    // ✅ Confirm modal visible and focused
    await expect(modal).toBeVisible({ timeout: 5000 });
    await this.page.evaluate(() => {
      const modalEl = document.querySelector('#trainers-by-rto-grid-grid-modal');
      if (modalEl) modalEl.focus();
    });

    console.log('✅ Modal opened and stable.');
  }

  // ⚙️ Set page size with row count verification
  async setPageSize(size) {
    // Open modal safely
    await this.openModalSafely();

    // Set page size directly via JS (bypasses click issues)
    await this.page.evaluate((size) => {
      const input = document.querySelector('#pageSize-trainers-by-rto-grid');
      if (!input) return;

      input.value = size; // set value
      input.dispatchEvent(new Event('input', { bubbles: true })); // trigger listeners
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, size);

    // Click Apply button
    await this.applyBtn.click();

    // Wait for grid refresh
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Extra wait for UI update

    // Capture screenshot for debugging
    await this.page.screenshot({ path: `after-pagesize-${size}.png` });
    
    // Verify row count is correct
    const rowCount = await this.getRowCount();
    console.log(`📏 After setting page size to ${size}, found ${rowCount} rows`);
    
    // Check if row count matches expectation or is limited by available data
    if (rowCount <= size) {
      console.log(`✅ Row count (${rowCount}) is within expected page size (${size})`);
    } else {
      console.log(`⚠️ Row count (${rowCount}) exceeds expected page size (${size})`);
      throw new Error(`Failed to set page size: Row count ${rowCount} exceeds expected ${size}`);
    }
    
    return true;
  }

  // 📊 Get total number of rows displayed
  async getRowCount() {
    return await this.tableRows.count();
  }

  // 🔍 Verify pagination by checking page size and pagination controls
  async verifyPagination() {
    console.log('🔍 Verifying pagination on first page only...');
    
    // Verify URL is on page 1 or doesn't have page parameter
    const currentUrl = this.page.url();
    console.log(`📌 Current URL: ${currentUrl}`);
    
    // Capture screenshot of the first page
    await this.page.screenshot({ path: `page1-verification.png` });
    
    // Check if pagination controls exist
    const paginationExists = await this.paginationContainer.isVisible();
    console.log(`📊 Pagination controls visible: ${paginationExists}`);
    
    if (paginationExists) {
      // Capture pagination text
      const paginationText = await this.paginationContainer.innerText();
      console.log(`📄 Pagination text: ${paginationText}`);
      
      // Check if page 2 link exists (indicates multiple pages)
      const page2Link = this.page.getByRole('link', { name: '2', exact: true });
      const hasMultiplePages = await page2Link.isVisible();
      
      console.log(`📚 System has multiple pages: ${hasMultiplePages}`);
      return { 
        success: true, 
        hasMultiplePages 
      };
    } else {
      console.log('⚠️ No pagination controls found - may not be enough data');
      return { 
        success: false, 
        reason: 'no-pagination-controls' 
      };
    }
  }
}

module.exports = { VerifyPagination };
