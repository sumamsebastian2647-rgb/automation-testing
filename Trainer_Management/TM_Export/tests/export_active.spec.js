// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('../config');
const { LoginPage } = require('./pages/LoginPage');
const { LogoutPage } = require('./pages/LogoutPage');
const { ExportPage } = require('./pages/ExportPage');
const fs = require('fs');


// Reusable login before each test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');
  const exportPage = new ExportPage(page);
 
});
 test('should export active trainers in all formats', async ({ page }) => {
    const exportPage = new ExportPage(page);
    const formats = ['pdf', 'xls', 'csv', 'json'];
    
    for (const format of formats) {
      // Export active trainers
      const filePath = await exportPage.exportActiveTrainers(format);
      
      // Verify file exists
      expect(await exportPage.verifyExportFile(filePath)).toBeTruthy();
    }
  });

  test('should export inactive trainers in all formats', async ({ page }) => {
    const exportPage = new ExportPage(page);
    const formats = ['pdf', 'xls', 'csv', 'json'];
    
    for (const format of formats) {
      // Export inactive trainers
      const filePath = await exportPage.exportInactiveTrainers(format);
      
      // Verify file exists
      expect(await exportPage.verifyExportFile(filePath)).toBeTruthy();
    }
  });