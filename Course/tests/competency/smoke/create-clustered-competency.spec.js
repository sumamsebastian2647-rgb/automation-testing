const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Create Clustered Competency - Smoke', () => {
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
  
  test('@smoke Create a clustered competency with two existing competencies', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);

    // Create clustered competency
    const uniqueCompetencyCode3 = config.createCompetencyData.getUniqueCompetencyCode();
    const uniqueCompetencyName3 = config.createCompetencyData.getUniqueCompetencyName();

    // Fill in basic competency details
    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode3);
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName3);
    // Select "Yes" for clustered competency
    await dashboardPage.selectClustered('1'); // Yes
await dashboardPage.selectFirstTwoCompetencies();
   
        await dashboardPage.uploadCompetencyLearningMaterial(config.createCompetencyData.learningMaterialPath);
        await dashboardPage.uploadCompetencyScormMaterial(config.createCompetencyData.scormMaterialPath);
  

    
    // Save the clustered competency
    await dashboardPage.clickSaveCompetency();
    // Navigate to Competency List and search for the newly created competency
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.searchCompetencyInList(uniqueCompetencyCode3, uniqueCompetencyName3);

    // Verify the competency is visible in the results
    const results = page.locator('table tbody tr');
    await expect(results.first()).toContainText(uniqueCompetencyCode3);
    await expect(results.first()).toContainText(uniqueCompetencyName3);
    await expect(results.first()).toContainText('Yes');

    console.log(`✅ Created clustered competency: Code: ${uniqueCompetencyCode3}, Name: ${uniqueCompetencyName3}`);
  });
});