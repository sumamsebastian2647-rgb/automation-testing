// Created by Sumam Sebastian on 09/10/2025
const { expect, test } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const config = require('../config');
const {DashboardPage}=require('./Pages/DashboardPage');

test.describe('Trainer Management Tooltip Tests', () => {
  test.use({ timeout: 60000 }); 
  let dashboardPage;
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.openTrainerManagement();
  });
    test('Verify tooltip for view action icon', async ({ page }) => {
        // Locate the first "view" icon
        const viewIcon = page.locator('a[title="view"]').first();
        // Hover over it (optional for title tooltip)
        await viewIcon.hover();
        // Get the tooltip text
        const tooltipText = await viewIcon.getAttribute('title');
        // Assert tooltip text
        expect(tooltipText).toBe('view');
        // Log success if passed
        if (tooltipText === 'view') {
            console.log(`✅ Test Passed: Tooltip verified successfully and it is "${tooltipText}"`);
        } else {
            console.log(`❌ Test Failed: Expected "view" but found "${tooltipText}"`);
        }
    });
    test('Verify tooltip for update action icon', async ({ page }) => {
        // Locate the first "view" icon
        const viewIcon = page.locator('a[title="update"]').first();
        // Hover over it (optional for title tooltip)
        await viewIcon.hover();
        // Get the tooltip text
        const tooltipText = await viewIcon.getAttribute('title');
        // Assert tooltip text
        expect(tooltipText).toBe('update');
        // Log success if passed
        if (tooltipText === 'update') {
           console.log(`✅ Test Passed: Tooltip verified successfully and it is "${tooltipText}"`);
        } else {
            console.log(`❌ Test Failed: Expected "update" but found "${tooltipText}"`);
        }
    });
    test('Verify tooltip for Active Trainer action icon', async ({ page }) => {
        // Locate the first "view" icon
        const viewIcon = page.locator('a[title="Active Trainer"]').first();
        // Hover over it (optional for title tooltip)
        await viewIcon.hover();
        // Get the tooltip text
        const tooltipText = await viewIcon.getAttribute('title');
        // Assert tooltip text
        expect(tooltipText).toBe('Active Trainer');
        // Log success if passed
        if (tooltipText === 'Active Trainer') {
            console.log(`✅ Test Passed: Tooltip verified successfully and it is "${tooltipText}"`);
        } else {
            console.log(`❌ Test Failed: Expected "Inactive Trainer" but found "${tooltipText}"`);
        }
    });
   
});
