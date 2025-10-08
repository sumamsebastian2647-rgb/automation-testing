// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { UpdateAdminPage } = require('./pages/UpdateAdminPage');
const config = require('../config');

async function checkUIValidations(page) {
  test.setTimeout(600000);
  const loginPage = new LoginPage(page);
  const updateAdminPage = new UpdateAdminPage(page);
  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');
  // Step 2: Go to Create Admin page
  await updateAdminPage.navigateToCreateAdmin();

  // ---------- PHASE 1: Blank fields ----------
  await updateAdminPage.fillAdminFormWithBlanks();
  await updateAdminPage.saveAdmin();
  await page.waitForSelector('.error-summary');
  const blankFieldErrors = [
   
    'Email cannot be blank.',
    'First Name cannot be blank.',
    'Last Name cannot be blank.'
  ];
  for (const message of blankFieldErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }

  // ---------- PHASE 2: Format validation ----------
  await page.reload();
 
  await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('fdfd');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('fdf');
  await updateAdminPage.saveAdmin();
  await page.waitForSelector('.error-summary');
  const formatErrors = [
    'Email is not a valid email address.',
     ];
  for (const message of formatErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }
   // ---------- PHASE 3: Format validation password----------
  await page.reload();
    await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('testusercloudemy+user@gmail.com');
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('fdfd');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('fdf');
  await updateAdminPage.saveAdmin();
  const toast = page.locator('text=Profile has been updated successfully.');
  await expect(toast).toHaveCount(1, { timeout: 5000 });
      
}
// This is the part that actually creates a runnable test:
test('UI validations - Create Admin form', async ({ page }) => {
  await checkUIValidations(page);
  console.log('validated UI');
});
