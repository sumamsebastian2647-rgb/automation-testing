// Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const config = require('../config');

// Generate unique trainer credentials for this test
test.describe.serial('Trainer Management -Update Trainer- Other Documents', () => {
  test.use({ timeout: 6000000 });
  let dashboardPage;
   let page; // Declare page variable at the describe level
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage(); // Initialize page here
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.openTrainerManagement();
    await dashboardPage.openUpdateTrainer();
      
  });

  // ✅ Close after all tests
  test.afterAll(async () => {
    await page.close();
  });
 
  test('Update Trainer-Add documents', async () => { // Removed 'page' parameter
     await dashboardPage.openUpdateTrainerdoc();
       await dashboardPage.uploadOtherDocument(
      config.personalInfo.photo,      // from config
      config.otherdocumentname.testdocument       // from config
    );
    await page.waitForTimeout(2000); // Use the 'page' variable from describe level
    await dashboardPage.verifyFirstRowHasDocument(config.otherdocumentname.testdocument);
  });

  test('Update Trainer-Add documents UI', async () => { // Removed 'page' parameter
        await dashboardPage.openUpdateTrainerdoc();
       // Click Add Document button
    const addDocBtn = page.getByRole('button', { name: 'Add Document' });
    await addDocBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addDocBtn.click();
    const saveButton = page.locator('#formTrainerOtherDocuments button.btn-success.btn-flat');
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();
    // Wait for required error message
    const errorList = page.locator('ul > li');
    await expect(errorList.filter({ hasText: 'Document Name cannot be blank.' })).toBeVisible();
    await expect(errorList.filter({ hasText: 'Document cannot be blank.' })).toBeVisible();
    // Fill only document name, leave upload empty → should still show file error
    await page.getByLabel('Document Name').fill('Trainer Certificate');
    await saveButton.click();
    await expect(errorList.filter({ hasText: 'Document cannot be blank.' })).toBeVisible();
    // Upload invalid file format (optional validation)
    const docUploadBtn = page.getByRole('button', { name: 'Document*' });
    await docUploadBtn.setInputFiles(config.otherdocumentname.docfile1);
       await saveButton.click();
    // If system has allowed file types validation
   await expect(errorList.filter({ hasText: 'Only files with these extensions are allowed: jpg, jpeg, png, pdf.' })).toBeVisible();
    // Upload valid document
    await docUploadBtn.setInputFiles(config.otherdocumentname.docfile2);
    await saveButton.click();

    // Expect success message or validation errors cleared  ` 
    const successMsg = page.getByText(/Document has been saved successfully./i);
    await expect(successMsg).toBeVisible({ timeout: 5000 });

  });

  
  test('Update Trainer-delete documents', async () => { // Removed 'page' parameter
        // Check if Create Trainer button is visible
              await dashboardPage.deleteFirstDocument(config.otherdocumentname.testdocument);
  });

});
