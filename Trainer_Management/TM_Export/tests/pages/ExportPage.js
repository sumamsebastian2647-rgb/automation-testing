// ExportPage.js
const { expect } = require('@playwright/test');
const os = require('os');
const path = require('path');
const fs = require('fs');

class ExportPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.trainerMenuLink = page.getByRole('link', { name: ' Trainer Management' });
    this.exportButton = page.locator('#w1');
    this.exportMenu = page.locator('#w2');   // dropdown menu <ul>
    this.pdfOption = page.locator('a.export-pdf');
    this.exportXlsLink = page.locator('a.export-xls');
    this.exportCsvLink = page.locator('a.export-csv');
    this.exportJsonLink = page.locator('a.export-json');
    this.modalOkButton = page.locator('div.bootstrap-dialog-footer button.btn-warning:has-text("Ok")');
    this.showInactiveTrainersButton = page.locator('a.btn-warning.btn-flat:has-text("Show Inactive Trainers")');
  }
  /**
   * Navigate to active trainers page and open export menu
   */
  async navigateToActiveTrainers() {
    await this.trainerMenuLink.click();
    await this.page.waitForLoadState('networkidle');
    
    // If we're on inactive page, navigate to active page
    const currentUrl = this.page.url();
    if (currentUrl.includes('inactive=1')) {
      await this.page.goto('https://rto2503.cloudemy.au/user-trainers/index');
      await this.page.waitForLoadState('networkidle');
    }
        // Verify we're on the active trainers page
    console.log('✅ On active trainers page');
        // Open export dropdown
    await this.exportButton.click();
  }

  /**
   * Navigate to inactive trainers page and open export menu
   */
  async navigateToInactiveTrainers() {
    await this.trainerMenuLink.click();
    await this.page.waitForLoadState('networkidle');
        // Click "Show Inactive Trainers" button
    await this.showInactiveTrainersButton.waitFor({ state: 'visible' });
    await this.showInactiveTrainersButton.click();
    await this.page.waitForLoadState('networkidle');
        // Verify we're on the inactive trainers page
    const url = this.page.url();
    if (!url.includes('inactive=1')) {
      throw new Error('Failed to navigate to inactive trainers page');
    }
    console.log('✅ On inactive trainers page');
        // Open export dropdown
    await this.exportButton.click();
  }
  /**
   * Export as specified format from current page
   * @param {string} format - 'pdf', 'xls', 'csv', or 'json'
   * @param {string} filePrefix - prefix for the saved file
   */
  async exportAs(format, filePrefix = 'Trainers') {
    // Select the right export option based on format
    let exportLink;
    let fileExtension;
    
    switch (format.toLowerCase()) {
      case 'pdf':
        exportLink = this.pdfOption;
        fileExtension = 'pdf';
        break;
      case 'xls':
      case 'excel':
        exportLink = this.exportXlsLink;
        fileExtension = 'xls';
        break;
      case 'csv':
        exportLink = this.exportCsvLink;
        fileExtension = 'csv';
        break;
      case 'json':
        exportLink = this.exportJsonLink;
        fileExtension = 'json';
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    await exportLink.waitFor({ state: 'visible' });
    await exportLink.click();
    console.log(`✅ Export -> ${format.toUpperCase()} clicked`);
    
    // Handle modal and download
    await this.modalOkButton.waitFor({ state: 'visible' });
    
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.modalOkButton.click()
    ]);
    
    // Save the file with appropriate name
    const downloadsDir = path.join(os.homedir(), 'Downloads');
    const fileName = `${filePrefix}_${format}.${fileExtension}`;
    const filePath = path.join(downloadsDir, fileName);
    
    await download.saveAs(filePath);
    console.log(`✅ File saved at: ${filePath}`);
    
    return filePath;
  }

  /**
   * Export active trainers in the specified format
   * @param {string} format - 'pdf', 'xls', 'csv', or 'json'
   */
  async exportActiveTrainers(format) {
    await this.navigateToActiveTrainers();
    return this.exportAs(format, 'Trainers_active');
  }

  /**
   * Export inactive trainers in the specified format
   * @param {string} format - 'pdf', 'xls', 'csv', or 'json'
   */
  async exportInactiveTrainers(format) {
    await this.navigateToInactiveTrainers();
    return this.exportAs(format, 'Trainers_inactive');
  }

  /**
   * Verify exported file exists
   * @param {string} filePath - path to the exported file
   */
  async verifyExportFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ File not found: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    console.log(`✅ File exists (${stats.size} bytes): ${filePath}`);
    return true;
  }
}

module.exports = { ExportPage };
