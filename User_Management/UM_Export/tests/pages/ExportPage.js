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
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    this.exportButton = page.locator('#w1');
    this.exportMenu = page.locator('#w2');   // dropdown menu <ul>
    this.pdfOption = page.locator('a.export-pdf');
    this.modalOkButton = page.locator('div.bootstrap-dialog-footer button.btn-warning:has-text("Ok")'); // Ok button in modal
     this.exportXlsLink = page.locator('a.export-xls'); 
  }

  // Navigate to User Management and open export dropdown
  async navigateToCreateAdmin() {
    await this.userManagementLink.click();
   await this.page.click('#w1');
   
  }
  async exportaspdf() {
  const pdfLink = this.page.locator('a.export-pdf');
  await pdfLink.waitFor({ state: 'visible' });
  await pdfLink.click();
  console.log('✅ Export -> PDF clicked successfully');

  await this.modalOkButton.waitFor({ state: 'visible' });

  const [download] = await Promise.all([
    this.page.waitForEvent('download'),
    this.modalOkButton.click()
  ]);

  // Save file to your Downloads folder explicitly
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const filePath = path.join(downloadsDir, 'Admins_pdf.pdf');
  await download.saveAs(filePath);
  console.log(`✅ PDF saved at: ${filePath}`);
}
  async verifyExportPDF() {
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('Admins_pdf') && f.endsWith('.pdf'));

  if (files.length === 0) {
    throw new Error('❌ Admins_pdf PDF not found in Downloads');
  }

  console.log('✅ Found downloaded file:', files[0]);
}
  /////////////////////////////////////
  async exportasexcel() {
  const excelLink = this.page.locator('#w2 li:nth-child(2) a');
  await excelLink.waitFor({ state: 'visible' });
  await excelLink.click();
  console.log('✅ Export -> XLS clicked successfully');

  await this.modalOkButton.waitFor({ state: 'visible' });

  // Wait for file to start downloading
  const [download] = await Promise.all([
    this.page.waitForEvent('download'),
    this.modalOkButton.click()
  ]);

  // --- Save downloaded file explicitly ---
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const savePath = path.join(downloadsDir, 'Admins_xls.xls');

  await download.saveAs(savePath);
  console.log(`✅ XLS saved at: ${savePath}`);
}
 async verifyExportxls() {
  const downloadsDir = path.join(os.homedir(), 'Downloads');

  // Check for file that starts with 'Admins' and ends with '.xls'
  const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('Admins_xls') && f.endsWith('.xls'));

  if (files.length === 0) {
    throw new Error('❌ Admins_xls XLS not found in Downloads');
  }

  console.log('✅ Found downloaded file:', files[0]);
}
  //////////////////////////////
 async exportascsv() {
  // Step 1: Wait for CSV export link
  const csvLink = this.page.locator('#w2 li:nth-child(3) a');
  await csvLink.waitFor({ state: 'visible' });

  // Step 2: Click and trigger modal
  await csvLink.click();
  console.log('✅ Export -> CSV clicked successfully');

  await this.modalOkButton.waitFor({ state: 'visible' });

  // Step 3: Wait for download event and click OK
  const [download] = await Promise.all([
    this.page.waitForEvent('download'),
    this.modalOkButton.click()
  ]);

  // Step 4: Save file explicitly to system Downloads folder
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const savePath = path.join(downloadsDir, 'Admins_csv.csv');
  await download.saveAs(savePath);

  console.log(`✅ CSV saved successfully at: ${savePath}`);
}

  async verifyExportcsv() {
  const downloadsDir = path.join(os.homedir(), 'Downloads');

  // find any file starting with Admins and ending with .csv
  const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('Admins_csv') && f.endsWith('.csv'));

  if (files.length === 0) {
    throw new Error('❌ Admins_csv CSV not found in Downloads');
  }

  console.log('✅ Found downloaded file:', files[0]);
}
  //////////////////////////////
 async exportasjson() {
  // Step 1: Locate and click JSON export option
  const jsonLink = this.page.locator('#w2 li:nth-child(4) a');
  await jsonLink.waitFor({ state: 'visible' });
  await jsonLink.click();
  console.log('✅ Export -> JSON clicked successfully');

  // Step 2: Wait for modal confirmation
  await this.modalOkButton.waitFor({ state: 'visible' });

  // Step 3: Wait for file to start downloading
  const [download] = await Promise.all([
    this.page.waitForEvent('download'),
    this.modalOkButton.click()
  ]);

  // Step 4: Save file explicitly
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const savePath = path.join(downloadsDir, 'Admins_json.json');
  await download.saveAs(savePath);

  console.log(`✅ JSON saved successfully at: ${savePath}`);
}
 async verifyExportjson() {
  const downloadsDir = path.join(os.homedir(), 'Downloads');

  // find file starting with Admins and ending with .json
  const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('Admins_json') && f.endsWith('.json'));

  if (files.length === 0) {
    throw new Error('❌ Admins_json JSON not found in Downloads');
  }

  console.log('✅ Found downloaded file:', files[0]);
}
}

module.exports = { ExportPage };
