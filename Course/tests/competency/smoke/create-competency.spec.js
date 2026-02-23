const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Create Competency - Smoke', () => {
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

  test('@smoke Create Competency with unique code and name', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyCode = config.createCompetencyData.getUniqueCompetencyCode();
    const uniqueCompetencyName = config.createCompetencyData.getUniqueCompetencyName();
    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode);
    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName);
        // Upload learning material and SCORM if they exist
    await dashboardPage.uploadCompetencyLearningMaterial(config.createCompetencyData.learningMaterialPath);
    await dashboardPage.uploadCompetencyScormMaterial(config.createCompetencyData.scormMaterialPath);
    await dashboardPage.fillCreateCompetencyCodeavtmiss(uniqueCompetencyCode);
    await dashboardPage.fillCreateCompetencyNameavtmiss(uniqueCompetencyName);
    await dashboardPage.selectDeliveryMode('10');
    await dashboardPage.selectDeliveryStrategy('1');
    await dashboardPage.selectMultipleDeliveryModeRAPT(['C', 'R']);
    await dashboardPage.selectFundingSourceState(config.createCompetencyData.fundingSourceState);
    await dashboardPage.selectDeliveryModeAVETMISS(config.createCompetencyData.deliveryModeAVETMISS);
    await dashboardPage.selectPredominantDeliveryMode(config.createCompetencyData.predominantDeliveryMode);

    // Select the first value from the Funding Source National dropdown
    await dashboardPage.selectFundingSourceNational('11');

    // Verify the selected value is "11 - Commonwealth and state general purpose recurrent"
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

    // App may redirect to index after successful create, or stay on update/view page.
    await expect(page).toHaveURL(/competencies\/(index|update\?id=\d+|view\?id=\d+)/);

    // Validate form values only when still on a form page.
    if (/\/competencies\/(create|update\?id=\d+|view\?id=\d+)/.test(page.url())) {
      await expect(page.locator('#competencies-comp_code')).toHaveValue(uniqueCompetencyCode);
      await expect(page.locator('#competencies-comp_name')).toHaveValue(uniqueCompetencyName);
    }

    console.log(`Created Competency Code: ${uniqueCompetencyCode}`);
    console.log(`Created Competency Name: ${uniqueCompetencyName}`);

    // Navigate to Competency List and search for the newly created competency
    await dashboardPage.navigateToCompetencyList();
    await dashboardPage.searchCompetencyInList(uniqueCompetencyCode, uniqueCompetencyName);

    // Verify the competency is visible in the results
    const results = page.locator('table tbody tr');
    await expect(results.first()).toContainText(uniqueCompetencyCode);
    await expect(results.first()).toContainText(uniqueCompetencyName);
  });

  test('@smoke Cannot create competency without code', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyName = config.createCompetencyData.getUniqueCompetencyName();

    await dashboardPage.fillCreateCompetencyName(uniqueCompetencyName);
    await dashboardPage.clickSaveCompetency();

    await expect(page).toHaveURL(/competencies\/create/);
    await expect(page.locator('.field-competencies-comp_code .help-block.help-block-error'))
      .toHaveText('Code cannot be blank.');
  });

  test('@smoke Cannot create competency without name', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const uniqueCompetencyCode = config.createCompetencyData.getUniqueCompetencyCode();

    await dashboardPage.fillCreateCompetencyCode(uniqueCompetencyCode);
    await dashboardPage.clickSaveCompetency();

    await expect(page).toHaveURL(/competencies\/create/);
    // Error may appear in summary alert or in field-level help block
    const nameError = page.locator('.field-competencies-comp_name .help-block.help-block-error');
    const summaryError = page.locator('div.bg-danger li');
    const nameErrorVisible = await nameError.filter({ hasText: 'Name cannot be blank.' }).count();
    if (nameErrorVisible > 0) {
      await expect(nameError).toContainText('Name cannot be blank.');
    } else {
      await expect(summaryError.filter({ hasText: 'Name cannot be blank.' })).toBeVisible({ timeout: 10000 });
    }
  });

  test('@smoke Cannot create competency with spaces/special chars in code', async ({ page }) => {
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

  test('@smoke Cannot create competency with duplicate code', async ({ page }) => {
    const { dashboardPage } = await openCreateCompetencyForm(page);
    const duplicateCode = config.createCompetencyData.getUniqueCompetencyCode();
    const firstName = config.createCompetencyData.getUniqueCompetencyName();
    const secondName = config.createCompetencyData.getUniqueCompetencyName();
    // Create first competency with a unique code.
    await dashboardPage.fillCreateCompetencyCode(duplicateCode);
    await dashboardPage.fillCreateCompetencyName(firstName);
    await dashboardPage.saveCompetencyAndVerifySuccessToast();
    // Attempt to create again with same code.
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