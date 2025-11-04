 // Created by Sumam Sebastian on 10/10/2025
 const { test, expect } = require('@playwright/test');
 const { LoginPage } = require('./Pages/LoginPage');
 const { DashboardPage } = require('./Pages/DashboardPage');
 const config = require('../config');
 // Generate unique trainer credentials for this test
 test.describe.serial('Trainer Management - Update Trainer Flow-Qualification', () => {
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
      test('Qualification UI - Validation Flow', async () => {
        // Step 1️⃣ - Navigate to Qualification section
            await dashboardPage.navigateToQualifications();
        // Step 2️⃣ - Click "Add Qualification"
        await page.getByRole('button', { name: 'Add Qualification' }).click();
        const form = page.locator('#formTrainerQualification');
        // Step 3️⃣ - Try saving without filling anything
        await form.getByRole('button', { name: 'Save' }).click();
        const errorSummary = form.locator('.error-summary');
        await expect(errorSummary).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Qualification Name cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Year Completed cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Institution cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Attach Evidence cannot be blank.' })).toBeVisible();
        // Step 4️⃣ - Fill Qualification Name only
        await form.getByRole('textbox', { name: 'Qualification Name*' }).fill('MTech');
        await form.getByRole('button', { name: 'Save' }).click();
        await expect(errorSummary.locator('li', { hasText: 'Year Completed cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Institution cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Attach Evidence cannot be blank.' })).toBeVisible();
        // Step 5️⃣ - Fill Year Completed only
        await form.getByRole('spinbutton', { name: 'Year Completed*' }).fill('2012');
        await form.getByRole('button', { name: 'Save' }).click();
        await expect(errorSummary.locator('li', { hasText: 'Institution cannot be blank.' })).toBeVisible();
        await expect(errorSummary.locator('li', { hasText: 'Attach Evidence cannot be blank.' })).toBeVisible();
        // Step 6️⃣ - Fill Institution only
        await form.getByRole('textbox', { name: 'Institution*' }).fill('CEP');
        await form.getByRole('button', { name: 'Save' }).click();
        await expect(errorSummary.locator('li', { hasText: 'Attach Evidence cannot be blank.' })).toBeVisible();
        // Step 7️⃣ - Attach Evidence
        await form.locator('input[type="file"]').setInputFiles(config.trainerPD.evidenceFiles);
        // Step 8️⃣ - Final Save
        await form.getByRole('button', { name: 'Save' }).click();
        await expect(
        page.getByText('Qualification has been saved successfully.', { exact: true })
      ).toBeVisible();

     });

      // ADD Qualification
      test('Add Qualification', async () => {
         
          await dashboardPage.addQualification(
          config.qualification.add.name,
          config.qualification.add.institution,
          config.qualification.add.year,
          config.qualification.add.expiryDate,
          config.qualification.add.comment,
          config.qualification.add.evidenceFile
        );
        await expect(page.getByText(config.qualification.messages.saveToast)).toBeVisible();
      });

      // UPDATE Qualification
      test('Update Qualification - First Row', async () => {
          //await dashboardPage.navigateToQualifications();
          await dashboardPage.updateQualification(
            config.qualification.update.name,
            config.qualification.update.institution,
            config.qualification.update.comment,
            config.qualification.update.expiryDate
          );
          await expect(
            page.getByText('Qualification has been saved successfully.', { exact: true })
          ).toBeVisible();
          // ✅ After toast appears — click Cancel to return to main list
            await page.locator('#btnCancelQua').click();
            // ✅ Wait until the Work Experience list is visible again
            const qua = page.locator('#trainer-qualification');
            await expect(qua).toBeVisible({ timeout: 10000 });
      });

      // DELETE Qualification
      test('Delete Qualification - First Row', async () => {
        // await dashboardPage.navigateToQualifications();
          await dashboardPage.clickDeleteOnFirstQualification();

          await expect(
            page.getByText('Qualification has been deleted successfully.', { exact: true })
          ).toBeVisible();
      });
  // ✅ 5. Filter by Qualification Name
/*test('Filter by Qualification Name', async () => {
  test.setTimeout(60000);
   await page.locator('a[data-toggle="tab"][href="#trainer-qualification"]').click();
  await page.waitForSelector('#qualification table tbody', { timeout: 15000 });
  // Wait for input visibility
  const qualificationNameInput = page.locator('#qualification input[name="UserTrainersQualificationsSearch[qualification_name]"]');
  await expect(qualificationNameInput).toBeVisible({ timeout: 15000 });
  // Filter
  await qualificationNameInput.fill('IT');
  await qualificationNameInput.press('Enter');
  // Wait for table update
  const qualificationTable = page.locator('#qualification table tbody');
  await expect(qualificationTable).toBeVisible({ timeout: 15000 });
  const firstRow = qualificationTable.locator('tr').first();
  await firstRow.waitFor({ state: 'visible', timeout: 10000 });
  await expect(firstRow.locator('td').nth(1)).toContainText(/IT/i);
  // Clear filter
  await qualificationNameInput.fill('');
  await qualificationNameInput.press('Enter');
});

// ✅ 6. Filter by Year Completed
test('Filter by Year Completed', async () => {
  await dashboardPage.navigateToQualifications();

  const yearInput = page.locator(
    '#qualification input[name="UserTrainersQualificationsSearch[year_completed]"]'
  );

  await yearInput.fill('2015');
  await yearInput.press('Enter');

  const qualificationTable = page.locator('#qualification table tbody');
  await expect(qualificationTable).toBeVisible({ timeout: 10000 });

  const firstRow = qualificationTable.locator('tr').first();
  await firstRow.waitFor({ state: 'visible', timeout: 10000 });

  await expect(firstRow.locator('td')).toContainText('2015');

  // Clear filter
  await yearInput.fill('');
  await yearInput.press('Enter');
});

// ✅ 7. Filter by Institution Name
test('Filter by Institution Name', async () => {
  await dashboardPage.navigateToQualifications();

  const institutionInput = page.locator(
    '#qualification input[name="UserTrainersQualificationsSearch[institution]"]'
  );

  await institutionInput.fill('DEF');
  await institutionInput.press('Enter');

  const qualificationTable = page.locator('#qualification table tbody');
  await expect(qualificationTable).toBeVisible({ timeout: 10000 });

  const firstRow = qualificationTable.locator('tr').first();
  await firstRow.waitFor({ state: 'visible', timeout: 10000 });

  await expect(firstRow.locator('td').nth(2)).toContainText(/DEF/i);

  // Clear filter
  await institutionInput.fill('');
  await institutionInput.press('Enter');
});*/


 });
 