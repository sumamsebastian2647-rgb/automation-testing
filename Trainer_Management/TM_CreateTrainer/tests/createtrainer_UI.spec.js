// Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { CreateTrainerPage } = require('./Pages/CreateTrainerPage');
const config = require('../config');

async function checkTrainerUIValidations(page) {
  const loginPage = new LoginPage(page);
  const createTrainerPage = new CreateTrainerPage(page);

  // Define locators for address fields
  const postPoBox = page.locator('#usertrainers-post_pobox');
  const postCity = page.locator('#usertrainers-post_city_suburb');
  const postCode = page.locator('#usertrainers-post_post_code');

  // Step 1️⃣: Login
  await loginPage.goto();
  await loginPage.login(config.credentials.username, config.credentials.password);
  await page.waitForLoadState('networkidle');

  // Step 2️⃣: Navigate to Create Trainer page
  await createTrainerPage.navigateToCreateTrainer();

  // ---------------- PHASE 1: Blank field validations ----------------
  await createTrainerPage.copyAddressAndSave();
  await page.waitForSelector('.error-summary');
  const blankFieldErrors = [
    'Username cannot be blank.',
    'Email cannot be blank.',
    'Title cannot be blank.',
    'First Name cannot be blank.',
    'Last Name cannot be blank.',
    'City/Suburb cannot be blank.',
    'Post Code cannot be blank.'
  ];
  for (const message of blankFieldErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }
  console.log('✅ Blank field validations passed');
  await page.waitForTimeout(2000);
    // ---------------- PHASE 2: Invalid format validations ----------------
  await page.reload();
  await page.getByRole('textbox', { name: 'Username*' }).fill('testuser11');
  await page.getByRole('textbox', { name: 'Email*' }).fill('invalidemail');
  await page.getByLabel('Title').selectOption('Mr');
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Test11');
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Trainer');
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('textbox', { name: 'Mobile' }).fill('343434');
  await postCity.fill('asa');
  await postCode.fill('AAA'); // Invalid format
  await createTrainerPage.copyAddressAndSave();
   await page.waitForSelector('.help-block-error:visible', { timeout: 10000 });
  const formatErrors = [
    'Email is not a valid email address.',
    'Password should contain at least 6 characters.',
    'Mobile is invalid.',
     ];
  for (const message of formatErrors) {
    await expect(page.locator(`.help-block-error:has-text("${message}")`)).toBeVisible();
  }
  console.log('✅ Format validations passed');
  await page.waitForTimeout(2000);
  
  // ---------------- PHASE 3: Password strength validations ----------------
  await page.reload();
  await page.getByRole('textbox', { name: 'Username*' }).fill('trainer011');
  await page.getByRole('textbox', { name: 'Email*' }).fill('trainer011@mailinator.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('trainer11');
  await page.getByLabel('Title').selectOption('Mr');
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Trainer');
  await page.getByRole('textbox', { name: 'Mobile' }).fill('043232323');
  await postPoBox.fill('PO234');
  await postCity.fill('Bangalore');
  await postCode.fill('560001');
  await createTrainerPage.copyAddressAndSave();
  await page.waitForSelector('.error-summary');
  const passwordErrors = [
    'Password must contain Upper Case Letter, Lower Case Letter and One Special Character.'
  ];
  for (const message of passwordErrors) {
    await expect(page.getByText(message, { exact: true }).first()).toBeVisible();
  }
  console.log('✅ Password strength validations passed');
   await page.reload();
  //----------------------------------
  const trainerCreds = config.generateUserCredentials('Trainer');
    await createTrainerPage.fillBasicDetails({
        username: trainerCreds.username,
        email: trainerCreds.email,
        password: config.defaultPassword,
        title: 'Mr',
        firstName: trainerCreds.firstName,
        middleName: '',
        lastName: trainerCreds.lastName,
        dob: config.personalInfo.dob,
        gender: 'Female',
        mobile: config.personalInfo.phoneNumber
      });
          await createTrainerPage.fillAddress(config.addressInfo);
          await createTrainerPage.fillContact(config.personalInfo.phoneNumber);
          await createTrainerPage.selectCourseAndUploadPhoto(config.personalInfo.photo);
          await createTrainerPage.copyAddressAndSave();
          console.log(`✅ Trainer Created: ${trainerCreds.username} / ${trainerCreds.email}`);
  }

// ---------------- MAIN TEST ----------------
test('UI validations - Create Trainer form', async ({ page }) => {
  await checkTrainerUIValidations(page);
  console.log('🎯 Trainer form validations completed successfully.');
});
