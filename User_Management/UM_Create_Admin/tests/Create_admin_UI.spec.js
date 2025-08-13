// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { CreateAdminPage } = require('./pages/CreateAdminPage');
const config = require('../config');

async function checkUIValidations(page) {
  const loginPage = new LoginPage(page);
  const createAdminPage = new CreateAdminPage(page);
  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');
  // Step 2: Go to Create Admin page
  await createAdminPage.navigateToCreateAdmin();

  // ---------- PHASE 1: Blank fields ----------
  await createAdminPage.fillAdminFormWithBlanks();
  await createAdminPage.saveAdmin();
  await page.waitForSelector('.error-summary');
  const blankFieldErrors = [
    'Username cannot be blank.',
    'Email cannot be blank.',
    'First Name cannot be blank.',
    'Last Name cannot be blank.'
  ];
  for (const message of blankFieldErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }

  // ---------- PHASE 2: Format validation ----------
  await page.reload();
  await page.getByRole('textbox', { name: 'Username*' }).click();
  await page.getByRole('textbox', { name: 'Username*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('fdfd');
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('fdfd');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('fdfd');
  await createAdminPage.saveAdmin();
  await page.waitForSelector('.error-summary');
  const formatErrors = [
    'Email is not a valid email address.',
    'Password should contain at least 6 characters.',
    'Phone Number is invalid.'
  ];
  for (const message of formatErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }
   // ---------- PHASE 3: Format validation password----------
  await page.reload();
  await page.getByRole('textbox', { name: 'Username*' }).click();
  await page.getByRole('textbox', { name: 'Username*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('fdf@ff.ll');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('fdfd11');
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('fdfd');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('fdf');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
await page.getByRole('textbox', { name: 'Phone Number' }).fill('1111111111');
   await createAdminPage.saveAdmin();
  await page.waitForSelector('.error-summary');
  const formatpassword = [
    'Password must contain Upper Case Letter, Lower Case Letter and One Special Character.'
  ];
  for (const message of formatpassword) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }
}

// This is the part that actually creates a runnable test:
test('UI validations - Create Admin form', async ({ page }) => {
  await checkUIValidations(page);
  console.log('validated UI');
});
