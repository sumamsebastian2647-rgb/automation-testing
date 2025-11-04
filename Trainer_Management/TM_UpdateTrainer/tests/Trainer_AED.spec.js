 // Created by Sumam Sebastian on 10/10/2025
 const { test, expect } = require('@playwright/test');
 const { LoginPage } = require('./Pages/LoginPage');
 const { DashboardPage } = require('./Pages/DashboardPage');
 const config = require('../config');
 test.describe.serial('Trainer Management - Update Trainer Flow-Trainer matrx', () => {
   test.use({ timeout: 6000000 }); 
    let dashboardPage;
     let page;
     // ✅ Login once and navigate to Work Experience before all tests
     test.beforeAll(async ({ browser }) => {
       page = await browser.newPage();
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
  
   test(' UI validation', async () => {
      await dashboardPage.navigateToMatrix();   
       // DELETE
    await dashboardPage.saveMatrix();
    await expect(page.getByText('Please fill out all the required fields before submitting the trainer matrix.')).toBeVisible();
  });
   test('create new trainer matrix record', async () => {
      await dashboardPage.navigateToMatrix();   
     // Pass specific test data
    await dashboardPage.fillTrainerMatrixForm(config.trainerMatrixData.case1);
    await dashboardPage.saveMatrix();
    await dashboardPage.verifySaveSuccess();
  });
    test(' Delete Trainer Matrix Record', async () => {
        await dashboardPage.navigateToMatrix();   
       // DELETE
    await dashboardPage.deleteFirstTrainerMatrix();
    await dashboardPage.verifyDeleteSuccess();
  });
  
 
 });
