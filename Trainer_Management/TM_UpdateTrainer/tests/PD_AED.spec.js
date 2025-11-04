 // Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const config = require('../config');

test.describe.serial('Trainer Management - Update Trainer Flow-Professional Development', () => {
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
  /////////search 
   test('Update Trainer-Add Professional Development', async () => {
    await dashboardPage.navigateToPD();
    await page.getByRole('button', { name: 'Add Professional Development' }).click();
    await dashboardPage.addProfessionalDevelopment(config.trainerPD);
    await page.waitForTimeout(2000);
    await expect(page.getByText('Professional Development has been saved successfully.')).toBeVisible();
  });
  
   test('Update Trainer-Add Professional Development-UI', async () => {
                await dashboardPage.navigateToPD();
        // Open Add PD form
      await page.getByRole('button', { name: 'Add Professional Development' }).click();
      // ---- 1) VALIDATION: Save with empty form
      await page.locator('#formTrainerPD').getByRole('button', { name: 'Save' }).click();
      // ✅ Assert combined error message visible
      await expect(
        page.getByRole('listitem').filter({ hasText: 'Organisation Name cannot be blank' })
      ).toBeVisible();
      await expect(
        page.getByRole('listitem').filter({ hasText: 'Start Date cannot be blank' })
      ).toBeVisible();
      await expect(
        page.getByRole('listitem').filter({ hasText: 'End Date cannot be blank' })
      ).toBeVisible();
      // ---- 2) Fill only org name & check remaining errors
      await page.getByRole('textbox',  { name: 'Organisation Name*' }).fill('wewe');
      await page.locator('#formTrainerPD').getByRole('button', { name: 'Save' }).click();
      // ✅ Assert specific errors still showing
      await expect(page.getByRole('listitem').filter({ hasText: 'Start Date cannot be blank' })).toBeVisible();
      await expect(page.getByRole('listitem').filter({ hasText: 'End Date cannot be blank' })).toBeVisible();
      // ---- 3) Fill Start Date & validate End Date still required
     await page.locator('#usertrainersprofessionaldevelopment-start_date').fill('10-10-2023');
     await page.locator('#formTrainerPD').getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('listitem').filter({ hasText: 'End Date cannot be blank' })).toBeVisible();
      // ---- 4) Fill End Date and Save
       await page.locator('#usertrainersprofessionaldevelopment-end_date').fill('10-10-2026');
       await page.locator('#formTrainerPD').getByRole('button', { name: 'Save' }).click();
      await expect(
        page.getByText('Professional Development has been saved successfully.', { exact: true })
      ).toBeVisible();
    });
////////////////////////////////////////////////////////////////////
test('Edit PD', async () => {
         await dashboardPage.navigateToPD();
  // navigate to edit screen before calling
  await dashboardPage.updatePD({
    orgName: 'updatepd',
    startDate: '10-09-2023',
    endDate: '10-10-2024',
  });
 await page.locator('.box-footer').getByRole('button', { name: 'Save' }).click();
   await expect(page.getByText('Professional Development has been saved successfully.')).toBeVisible();

// ✅ After toast appears — click Cancel to return to main list
            await page.locator('#btnCancelPD').click();
            // ✅ Wait until the Work Experience list is visible again
            const qua = page.locator('#development-currency');
            await expect(qua).toBeVisible({ timeout: 10000 });
});
/////////////////////////////////////////////////////////////////////////////////
test(' Delete PD', async () => {
           await dashboardPage.navigateToPD();
  await dashboardPage.deletePD();
});
/////////////////////////////////////////////////////////////////////////////////
 
  test('Search by Organisation', async () => {
        await dashboardPage.navigateToPD();
      // Search by Organisation Name
    await dashboardPage.searchByOrganisation(config.trainerPD.organisationName);
    // Optional: clear filter after test
    await dashboardPage.clearOrganisationFilter();
  });

  test('Filter by Notify Before', async () => {
        await dashboardPage.navigateToPD();
    // Filter Notify Before = 0
    await dashboardPage.filterNotifyBefore('Never');
    // Optional: clear filter after test
    //await dashboardPage.clearNotifyBeforeFilter();
  });
   test('Search by total  hours', async () => {
        await dashboardPage.navigateToPD();
      // Search by Organisation Name
    await dashboardPage.filterTotalHours(config.trainerPD.totalHours);
    // Optional: clear filter after test
    await dashboardPage.cleartotalhoursFilter();
  });
});
