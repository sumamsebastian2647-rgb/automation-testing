import { test, expect } from '@playwright/test';
import { LoginPage } from './Pages/LoginPage';
import { DashboardPage } from './Pages/DashboardPage';
const config = require('../config');

test.describe('Trainer View Page Verifications', () => {
  test.use({ timeout: 80000 });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const trainerPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await trainerPage.navigateToTrainerManagement();

    // Store in test context
    page.loginPage = loginPage;
    page.trainerPage = trainerPage;
  });

  // ✅ 1️⃣ Verify correct trainer page loaded
  test('Verify correct trainer view page loads with correct name', async ({ page }) => {
    const trainerPage = page.trainerPage;
    // Get first trainer name from first row
   const firstTrainerName = await trainerPage.getFirstTrainerName();
    await trainerPage.viewFirstTrainer();
    const headingName = await trainerPage.getTrainerHeaderText();
    // Case-insensitive check for first name
    expect(headingName.toLowerCase()).toContain(firstTrainerName.split(' ')[0].toLowerCase());
  });

  // ✅ 2️⃣ Verify Update button presence and opens update page
  test('Verify Update button exists and opens update page', async ({ page }) => {
    const trainerPage = page.trainerPage;
    const firstTrainerName = await trainerPage.getFirstTrainerName();
    await trainerPage.viewFirstTrainer();
    await trainerPage.verifyUpdateButtonVisible();
    await trainerPage.openUpdatePage();
    const headingName = await trainerPage.getTrainerHeaderText();
    // Case-insensitive check for first name
    expect(headingName.toLowerCase()).toContain(firstTrainerName.split(' ')[0].toLowerCase());
    await expect(page).toHaveURL(/update/i);
  });

  // ✅ 3️⃣ Inactivate Trainer
  test('Verify Inactivate Trainer works', async ({ page }) => {
    const trainerPage = page.trainerPage;
    await trainerPage.viewFirstTrainer();
    await trainerPage.inactivateTrainer();
 
  });

  // ✅ 4️⃣ Verify Back button functionality
  test('Verify Back button navigates to previous page', async ({ page }) => {
    const trainerPage = page.trainerPage;
    await trainerPage.viewFirstTrainer();
    await trainerPage.goBackToList();
    await expect(page).toHaveURL(/user-trainers|trainer-management/i);
  });
});
