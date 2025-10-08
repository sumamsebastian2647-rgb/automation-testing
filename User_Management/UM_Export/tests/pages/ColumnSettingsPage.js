// ./pages/ColumnSettingsPage.js
const { expect } = require('@playwright/test');

class ColumnSettingsPage {
  constructor(page) {
    this.page = page;
    this.userMgmtLink = page.getByRole('link', { name: ' User Management' });
    this.settingsBtn = page.getByRole('button', { name: /|Settings|Visible Columns/ });
    this.visibleColumnsTab = page.getByText('Visible Columns');
    this.applyBtn = page.getByRole('button', { name: /Apply/ });
  }

  async navigateToUserManagement() {
    await this.userMgmtLink.click();
    await this.page.waitForSelector('text=User Management');
  }

  async openVisibleColumns() {
    await this.settingsBtn.click();
    await this.visibleColumnsTab.click();
  }

  async toggleColumn(columnName) {
    const option = this.page.getByRole('option', { name: new RegExp(columnName, 'i') });
    await option.click();
  }
/**
 * Drag a column from Visible to Hidden list reliably
 * @param {string} columnName - The column name to hide
 */
a
  async dragColumnToHidden(columnName) {
    const source = this.page.locator('ul.sortable-visible li', { hasText: columnName }).first();
    const target = this.page.locator('ul.sortable-hidden');

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    if (!sourceBox || !targetBox) throw new Error('Source or target bounding box not found');

    // Drag using real mouse events
    await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
    await this.page.mouse.up();

    await this.page.waitForTimeout(300); // wait for UI update
    console.log(`✅ "${columnName}" dragged to hidden`);
  }

  async dragColumnToHidden(columnName) {
  const source = this.page.locator('ul.sortable-visible li', { hasText: columnName }).first();
  const target = this.page.locator('ul.sortable-hidden');

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Source or target bounding box not found');

  await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await this.page.mouse.down();
  await this.page.waitForTimeout(100);
  await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
  await this.page.mouse.up();
  await this.page.waitForTimeout(300);

  // Trigger SortableJS events so the state updates
  await this.page.evaluate(() => {
    const sortableVisible = document.querySelector('ul.sortable-visible');
    const sortableHidden = document.querySelector('ul.sortable-hidden');
    if (!sortableVisible || !sortableHidden) return;
    sortableVisible.dispatchEvent(new Event('sortupdate', { bubbles: true }));
    sortableHidden.dispatchEvent(new Event('sortupdate', { bubbles: true }));
  });

  console.log(`✅ "${columnName}" dragged to hidden and SortableJS updated`);
}


  async verifyColumnVisibility(expectedVisible, expectedHidden) {
    const headers = await this.page.locator('table thead tr:not(.filters) th').allInnerTexts();
    console.log('📄 Table Headers:', headers);

    for (const col of expectedVisible) {
      if (!headers.includes(col)) throw new Error(`Expected visible column "${col}" not found`);
    }

    for (const col of expectedHidden) {
      if (headers.includes(col)) throw new Error(`Expected hidden column "${col}" is still visible`);
    }
    console.log('✅ Column visibility verified');
  }
async applyChangesAndWait() {
  await this.page.getByRole('button', { name: 'Apply' }).click();
  // Wait for table redraw / AJAX update
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(1000); // small buffer
}
async verifyColumnHidden(columnName) {
  await this.page.waitForTimeout(500); // short buffer
  const headers = await this.page.locator('table thead tr:not(.filters) th').allInnerTexts();
  if (headers.includes(columnName)) {
    throw new Error(`❌ Column "${columnName}" is still visible in the table`);
  }
  console.log(`✅ Column "${columnName}" is hidden successfully`);
}


  async applyChanges() {
    await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle');
  }



async getColumnOrder() {
  const listSelector = 'ul.sortable-visible.sortable';
  const items = this.page.locator(`${listSelector} li[draggable="true"]`);
  const count = await items.count();
  const order = [];
  for (let i = 0; i < count; i++) {
    const text = (await items.nth(i).innerText()).trim();
    order.push(text);
  }
  return order;
}

async reorderColumns(sourceColumn, targetColumn) {
  const listSelector = 'ul.sortable-visible.sortable';
  const source = this.page.locator(`${listSelector} li[draggable="true"]`, { hasText: sourceColumn });
  const target = this.page.locator(`${listSelector} li[draggable="true"]`, { hasText: targetColumn });
  await expect(source).toBeVisible();
  await expect(target).toBeVisible();
   // 2️⃣ Drag & drop using bounding boxes
  const srcBox = await source.boundingBox();
  const tgtBox = await target.boundingBox();
  if (!srcBox || !tgtBox) throw new Error('❌ Could not get bounding boxes for drag.');
  await this.page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
  await this.page.mouse.down();
  await this.page.waitForTimeout(300);
  await this.page.mouse.move(tgtBox.x + tgtBox.width / 2, tgtBox.y + tgtBox.height / 2);
  await this.page.waitForTimeout(300);
  await this.page.mouse.up();
  // 3️⃣ Log order after drag (before applying)
  const afterOrder = await this.getColumnOrder();
  console.log('📄 Column order AFTER reorder (before apply):', afterOrder);
}

}

module.exports = { ColumnSettingsPage };
