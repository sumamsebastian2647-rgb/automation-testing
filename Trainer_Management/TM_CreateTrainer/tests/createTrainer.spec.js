// Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const { CreateTrainerPage } = require('./Pages/CreateTrainerPage');
const config = require('../config');

// Generate unique trainer credentials for this test
const trainerCreds = config.generateUserCredentials('Trainer');
test.describe('Trainer Management - Create Trainer Flow', () => {
  test.use({ timeout: 80000 }); 
  let dashboardPage;
  let createTrainerPage;
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    createTrainerPage = new CreateTrainerPage(page);
  });
  test('Create trainer if license allows', async ({ page }) => {
        // Check if Create Trainer button is visible
       await dashboardPage.openTrainerManagement();
      const createButton = page.locator('a.btn.btn-success:has-text("Create Trainer")');
      await createButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ Create Trainer button is visible, proceeding...');
        const isVisible = await createButton.isVisible();
        if (!isVisible) {
          console.log('❌ Trainer creation limit reached. Create button not available.');
          test.skip(); // skip further steps
        } else {
          console.log('✅ Create Trainer button is visible, proceeding...');
        }
        // Navigate to Create Trainer page
        await createTrainerPage.navigateToCreateTrainer();
        // Fill the form using POM + config
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
        const firstNameToSearch = trainerCreds.firstName;
        const fullNameToVerify = `${trainerCreds.firstName} ${trainerCreds.lastName}`;
        await createTrainerPage.searchTrainerByFirstName(firstNameToSearch);
        await createTrainerPage.verifyFirstRowContains(firstNameToSearch);
  });
});
