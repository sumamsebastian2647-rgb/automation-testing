// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Course Management -Course search ', () => {
  let dashboardPage;
 

  // --- Login before each test ---
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToCourseCategory();
  });

 
 test('Search filters using config data', async ({ page }) => {
  
    await dashboardPage.searchByCategory(config.searchData.category);
    const textExists = await page.getByText('General Knowledge Course', { exact: false }).count();
        if (textExists > 0) {
        console.log("Text found!");
        } else {
        console.log("Text NOT found!");
        }
    await dashboardPage.reset();

    await dashboardPage.searchByCode(config.searchData.code);
   const found = await dashboardPage.verifyCourseByCode(config.searchData.code);
        if (!found) {
        throw new Error("Course code not found in search results!");
        }
    await dashboardPage.reset();

    await dashboardPage.searchByName(config.searchData.courseName);
    // Step 1: Check if course exists
    const found1 = await dashboardPage.verifyCourseByName(config.searchData.courseName);
    if (!found1) {
    throw new Error(`Course "${config.searchData.courseName}" was NOT found after searching`);
    }
    await dashboardPage.reset();
 

    /*wait dashboardPage.searchByType(config.searchData.type);
    await page.getByText(config.courseResults.diplomaLifeCoaching).click();
   
    await dashboardPage.searchByPrice(config.searchData.price);
    await dashboardPage.openCourse(config.courseResults.certificateIV);
    await dashboardPage.clickBack();*/
  });
});
