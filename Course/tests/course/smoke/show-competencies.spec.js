const { test, expect } = require('@playwright/test');
const config = require('../../../config/config');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');

test.describe('Show Competencies - Smoke', () => {
  async function openCourseList(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    await dashboardPage.navigateToCourseCategory();
    await expect(page).toHaveURL(/course\/index/);

    return { dashboardPage };
  }

  test('@smoke click first course Show Competencies button and verify popup/details open', async ({ page }) => {
    await openCourseList(page);

    const firstShowCompetenciesBtn = page
      .locator('.box .show-competencies-assessments')
      .first();

    await expect(firstShowCompetenciesBtn).toBeVisible();
    await firstShowCompetenciesBtn.click();

    const competencySearchInput = page.locator('#competencySearch');
    const competencyDetailsPanel = page.locator('#details.panel-group').first();
    const firstCompetencyPanel = competencyDetailsPanel.locator('.competency-panel').first();

    await expect(competencySearchInput).toBeVisible({ timeout: 15000 });
    await expect(competencyDetailsPanel).toBeVisible({ timeout: 15000 });
    await expect(firstCompetencyPanel).toBeVisible({ timeout: 15000 });
  });

  test('@smoke search in Show Competencies using competency search box', async ({ page }) => {
    await openCourseList(page);

    const firstShowCompetenciesBtn = page
      .locator('.box .show-competencies-assessments')
      .first();

    await expect(firstShowCompetenciesBtn).toBeVisible();
    await firstShowCompetenciesBtn.click();

    const competencySearchInput = page.locator('#competencySearch');
    const competencyDetailsPanel = page.locator('#details.panel-group').first();
    const firstCompetencyTitle = competencyDetailsPanel
      .locator('.competency-panel .panel-heading h4 span')
      .first();

    await expect(competencySearchInput).toBeVisible({ timeout: 15000 });
    await expect(firstCompetencyTitle).toBeVisible({ timeout: 15000 });

    // Fetch first competency full title and search for same value
    const firstTitleText = (await firstCompetencyTitle.innerText()).replace(/\s+/g, ' ').trim();
    const searchKeyword = firstTitleText;

    await competencySearchInput.fill(searchKeyword);
    await competencySearchInput.press('Enter');

    await expect(competencySearchInput).toHaveValue(searchKeyword);

    const visibleCompetencyHeadings = competencyDetailsPanel.locator('.competency-panel:visible .panel-heading h4 span');
    await expect(visibleCompetencyHeadings.first()).toContainText(searchKeyword, { timeout: 10000 });

    // Ensure searched first competency is present in filtered list
    await expect(
      competencyDetailsPanel
        .locator('.competency-panel:visible .panel-heading h4 span')
        .filter({ hasText: searchKeyword })
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('@smoke open first competency and click first Learning Material item', async ({ page }) => {
    await openCourseList(page);

    const firstShowCompetenciesBtn = page
      .locator('.box .show-competencies-assessments')
      .first();

    await expect(firstShowCompetenciesBtn).toBeVisible();
    await firstShowCompetenciesBtn.click();

    const competencyDetailsPanel = page.locator('#details.panel-group').first();
    const firstCompetencyHeading = competencyDetailsPanel
      .locator('.competency-panel .panel-heading')
      .first();

    await expect(firstCompetencyHeading).toBeVisible({ timeout: 15000 });
    await firstCompetencyHeading.click();

    const firstExpandedCompetencyBody = competencyDetailsPanel
      .locator('.competency-panel .panel-collapse.in .panel-body')
      .first();

    await expect(firstExpandedCompetencyBody).toBeVisible({ timeout: 10000 });
    await expect(firstExpandedCompetencyBody.getByText('Learning Materials')).toBeVisible();

    const firstLearningMaterialLink = firstExpandedCompetencyBody
      .locator('.clslearningmaterial a[href]')
      .first();

    await expect(firstLearningMaterialLink).toBeVisible({ timeout: 10000 });

    const [learningMaterialTab] = await Promise.all([
      page.waitForEvent('popup'),
      firstLearningMaterialLink.click(),
    ]);

    await learningMaterialTab.waitForLoadState('domcontentloaded');
    await expect(learningMaterialTab).toHaveURL(/(access-secure-file|scorm-view|competencies|uploads)/i);
    console.log(`✅ Learning Material opened in new tab: ${learningMaterialTab.url()}`);
    await learningMaterialTab.close();
  });

  test('@smoke open first assessment View button and verify new page opens', async ({ page }) => {
    await openCourseList(page);

    const firstShowCompetenciesBtn = page
      .locator('.box .show-competencies-assessments')
      .first();

    await expect(firstShowCompetenciesBtn).toBeVisible();
    await firstShowCompetenciesBtn.click();

    const competencyDetailsPanel = page.locator('#details.panel-group').first();
    const firstCompetencyHeading = competencyDetailsPanel
      .locator('.competency-panel .panel-heading')
      .first();

    await expect(firstCompetencyHeading).toBeVisible({ timeout: 15000 });
    await firstCompetencyHeading.click();

    const firstExpandedCompetencyBody = competencyDetailsPanel
      .locator('.competency-panel .panel-collapse.in .panel-body')
      .first();

    await expect(firstExpandedCompetencyBody).toBeVisible({ timeout: 10000 });
    await expect(firstExpandedCompetencyBody.getByText('Assessments')).toBeVisible();

    const firstAssessmentViewButton = firstExpandedCompetencyBody
      .locator('a[href*="/assessments/view?id="] button:has-text("View")')
      .first();

    await expect(firstAssessmentViewButton).toBeVisible({ timeout: 10000 });

    const [assessmentTab] = await Promise.all([
      page.waitForEvent('popup'),
      firstAssessmentViewButton.click(),
    ]);

    await assessmentTab.waitForLoadState('domcontentloaded');
    await expect(assessmentTab).toHaveURL(/\/assessments\/view\?id=\d+/);
    console.log(`✅ Assessment View opened in new page: ${assessmentTab.url()}`);

    await assessmentTab.close();
  });
});
