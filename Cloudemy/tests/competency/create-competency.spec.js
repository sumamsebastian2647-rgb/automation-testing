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

  test('@regression Create Competency with unique code and name', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyCode = config.createCompetencyData.getUniqueCompetencyCode();
    const uniqueCompetencyName = config.createCompetencyData.getUniqueCompetencyName();
    const filePath1 = path.join(process.cwd(),config.createCompetencyData.folder,config.createCompetencyData.learningMaterial);
        const filePath2 = path.join(process.cwd(),config.createCompetencyData.folder,config.createCompetencyData.scormMaterial);
    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode);
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName);
    await dashboardPage.uploadCompetencyLearningMaterial(filePath1);
    await dashboardPage.uploadCompetencyScormMaterial(filePath2);
    await dashboardPage.fillCreateCompetencyCodeavtmiss(uniqueCompetencyCode);
    await dashboardPage.fillCreateCompetencyNameavtmiss(uniqueCompetencyName);
    await dashboardPage.selectDeliveryMode('10');
    await dashboardPage.selectDeliveryStrategy('1');
    await dashboardPage.selectMultipleDeliveryModeRAPT(['C', 'R']);
    await dashboardPage.selectFundingSourceState(config.createCompetencyData.fundingSourceState);
    await dashboardPage.selectDeliveryModeAVETMISS(config.createCompetencyData.deliveryModeAVETMISS);
    await dashboardPage.selectPredominantDeliveryMode(config.createCompetencyData.predominantDeliveryMode);
    await dashboardPage.selectFundingSourceNational('11');
    const selectedOption = await dashboardPage.fundingSourceNationalDropdown.evaluate((selectEl) => {
      return selectEl.options[selectEl.selectedIndex].textContent?.trim();
    });
    await expect(selectedOption).toBe('11 - Commonwealth and state general purpose recurrent');
    console.log(`✅ Funding Source National selected: ${selectedOption}`);
    await dashboardPage.fillNominalHours(config.createCompetencyData.nominalhr);
    await dashboardPage.fillScheduledHours(config.createCompetencyData.scheduledhr);
    await dashboardPage.fillDeliveryProviderABN(config.createCompetencyData.DeliveryProviderABN);
    await dashboardPage.fillWorkplaceABN(config.createCompetencyData.WorkplaceABN);
    await dashboardPage.fillStudentContributionAmount(config.createCompetencyData.StudentContributionAmount);
    await dashboardPage.fillStudentContributionAmountOther(config.createCompetencyData.StudentContributionAmountOther);
    await dashboardPage.fillEmployerContributionAmount(config.createCompetencyData.EmployerContributionAmount);
    await dashboardPage.addRplChecklist('Test Checklist 1');
    await dashboardPage.saveCompetencyAndVerifySuccessToast();
    await expect(page).toHaveURL(/competencies\/(index|update\?id=\d+|view\?id=\d+)/);
    if (/\/competencies\/(create|update\?id=\d+|view\?id=\d+)/.test(page.url())) {
      await expect(page.locator('#competencies-comp_code')).toHaveValue(uniqueCompetencyCode);
      await expect(page.locator('#competencies-comp_name')).toHaveValue(uniqueCompetencyName);
    }
    console.log(`Created Competency Code: ${uniqueCompetencyCode}`);
    console.log(`Created Competency Name: ${uniqueCompetencyName}`);
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.searchCompetencyInList(uniqueCompetencyCode, uniqueCompetencyName);
    const results = page.locator('table tbody tr');
    await expect(results.first()).toContainText(uniqueCompetencyCode);
    await expect(results.first()).toContainText(uniqueCompetencyName);
  });

  test('@regression Cannot create competency without code', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyName = config.createCompetencyData.getUniqueCompetencyName();
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName);
    await dashboardPage.clickSaveCompetency();
    await expect(page).toHaveURL(/competencies\/create/);
    await expect(page.locator('.field-competencies-comp_code .help-block.help-block-error'))
      .toHaveText('Code cannot be blank.');
  });

  test('@regression Cannot create competency without name', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyCode = config.createCompetencyData.getUniqueCompetencyCode();
    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode);
    await dashboardPage.clickSaveCompetency();
    await expect(page).toHaveURL(/competencies\/create/);
    const nameError = page.locator('.field-competencies-comp_name .help-block.help-block-error');
    const summaryError = page.locator('div.bg-danger li');
    const nameErrorVisible = await nameError.filter({ hasText: 'Name cannot be blank.' }).count();
    if (nameErrorVisible > 0) {
      await expect(nameError).toContainText('Name cannot be blank.');
    } else {
      await expect(summaryError.filter({ hasText: 'Name cannot be blank.' })).toBeVisible({ timeout: 10000 });
    }
  });

  test('@regression Cannot create competency with spaces/special chars in code', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const invalidCompetencyCode = 'CMP 12@#';
    const uniqueCompetencyName = config.createCompetencyData.getUniqueCompetencyName();
    await dashboardPage.fillCreateCompetencyCode(invalidCompetencyCode);
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName);
    await dashboardPage.clickSaveCompetency();
    await expect(page).toHaveURL(/competencies\/create/);
    await expect(page.locator('.field-competencies-comp_code .help-block.help-block-error'))
      .toHaveText('Code can only contain letters, numbers, hyphens (-) and underscores (_). Spaces and special characters are not allowed.');
  });

  test('@regression Cannot create competency with duplicate code', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const duplicateCode = config.createCompetencyData.getUniqueCompetencyCode();
    const firstName = config.createCompetencyData.getUniqueCompetencyName();
    const secondName = config.createCompetencyData.getUniqueCompetencyName();
    await dashboardPage.fillCreateCompetencyCode(duplicateCode);
    await dashboardPage.fillCreateCompetencyName(firstName);
    await dashboardPage.saveCompetencyAndVerifySuccessToast();
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.clickCreateCompetency();
    await dashboardPage.fillCreateCompetencyCode(duplicateCode);
    await dashboardPage.fillCreateCompetencyName(secondName);
    await dashboardPage.clickSaveCompetency();
    await expect(page).toHaveURL(/competencies\/create/);
    const codeError = page.locator('.field-competencies-comp_code .help-block.help-block-error');
    const summaryError = page.locator('#alrtCompExist li');
    const codeErrorVisible = await codeError.filter({ hasText: 'Competency exist with same code.' }).count();
    if (codeErrorVisible > 0) {
      await expect(codeError).toContainText('Competency exist with same code.');
    } else {
      await expect(summaryError.filter({ hasText: 'Competency exist with same code.' })).toBeVisible({ timeout: 10000 });
    }
  });
});
