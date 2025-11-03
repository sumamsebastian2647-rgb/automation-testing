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
   console.log(firstTrainerName);
    await trainerPage.loginAsTrainer();
    await page.waitForTimeout(1000);
    const agreementCheckbox = page.locator('form:has-text("1. Agreement 1.1 Accepting") >> role=insertion');
    if (await agreementCheckbox.isVisible()) {
        console.log('First login detected: checking agreement checkbox...');
        await agreementCheckbox.click();
        await page.getByRole('button', { name: 'Agree & Continue' }).click();
    } else {
        console.log('Not first login: skipping agreement checkbox.');
    }
     // Step 6: Verify trainer name after login matches dashboard name
        const trainerParagraph = page.locator('p:has-text("Role Name: trainer")');
        // Get the full text content
        let fullText = await trainerParagraph.textContent();
        // Remove line breaks and extra spaces
        fullText = fullText.replace(/\n/g, ' ').trim();
        // Remove the small text (everything after 'Role Name:')
        const trainerName = fullText.split('Role Name:')[0].trim();
        console.log('Trainer name fetched:', trainerName);
            if (trainerName.includes(firstTrainerName.trim())) {
                console.log('✅ Trainer name verified:', trainerName);
            } else {
                console.error('❌ Trainer name mismatch! Dashboard:', firstTrainerName, 'Logged in:', trainerName);
            }
   });
});
