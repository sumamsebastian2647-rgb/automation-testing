const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const path = require('path');

test.describe('@competency Create Competency Module', () => {
  async function openCreateCompetencyForm(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.clickCreateCompetency();
    await expect(page).toHaveURL(/competencies\/create/);
    return { dashboardPage };
  }
  
  test('@regression Create a clustered competency with two existing competencies', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const filePath1 = path.join(process.cwd(),config.createCompetencyData.folder,config.createCompetencyData.learningMaterial);
    const filePath2 = path.join(process.cwd(),config.createCompetencyData.folder,config.createCompetencyData.scormMaterial);
    const uniqueCompetencyCode3 = config.createCompetencyData.getUniqueCompetencyCode();
    const uniqueCompetencyName3 = config.createCompetencyData.getUniqueCompetencyName();
    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode3);
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName3);
    await dashboardPage.selectClustered('1');
    await dashboardPage.selectFirstTwoCompetencies();
    await dashboardPage.uploadCompetencyLearningMaterial(filePath1);
    await dashboardPage.uploadCompetencyScormMaterial(filePath2);
    await dashboardPage.clickSaveCompetency();
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.searchCompetencyInList(uniqueCompetencyCode3, uniqueCompetencyName3);
    const results = page.locator('table tbody tr');
    await expect(results.first()).toContainText(uniqueCompetencyCode3);
    await expect(results.first()).toContainText(uniqueCompetencyName3);
    await expect(results.first()).toContainText('Yes');
    console.log(`✅ Created clustered competency: Code: ${uniqueCompetencyCode3}, Name: ${uniqueCompetencyName3}`);
  });
});
