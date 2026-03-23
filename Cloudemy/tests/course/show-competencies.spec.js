const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('@course Create Course Module', () => {
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
async function openCompetencyPanel(page) {
  const btn = page.locator('.show-competencies-assessments').first();
  await expect(btn).toBeVisible();

  await btn.click();

  const modal = page.locator('#detailsdivision .modal-body');
  await expect(modal).toBeVisible();

  // ✅ Target the panel-heading — always visible regardless of collapse state
  await expect(
    modal.locator('.competency-panel .panel-heading').first()
  ).toBeVisible({ timeout: 10000 });

  return modal;
}
  //smoke test to click first course Show Competencies button and verify popup/details open
  test('@smoke click first course Show Competencies button and verify popup/details open',
    async ({ page }) => {
      await openCourseList(page);
      const competencyDetailsPanel = await openCompetencyPanel(page);
      const competencySearchInput = page.locator('#competencySearch');
      const firstCompetencyPanel = competencyDetailsPanel
        .locator('.competency-panel')
        .first();
      await expect(competencySearchInput).toBeVisible({ timeout: 20000 });
      await expect(competencyDetailsPanel).toBeVisible({ timeout: 20000 });
      await expect(firstCompetencyPanel).toBeVisible({ timeout: 20000 });
    });
  //smoke test to search in Show Competencies using competency search box
  test('@smoke search in Show Competencies using competency search box',
    async ({ page }) => {
      await openCourseList(page);
      const competencyDetailsPanel = await openCompetencyPanel(page);
      const competencySearchInput = page.locator('#competencySearch');
      const firstCompetencyTitle = competencyDetailsPanel
        .locator('.competency-panel .panel-heading h4 span')
        .first();
      await expect(competencySearchInput).toBeVisible({ timeout: 20000 });
      await expect(firstCompetencyTitle).toBeVisible({ timeout: 20000 });
      const firstTitleText =
        (await firstCompetencyTitle.innerText())
          .replace(/\s+/g, ' ')
          .trim();
      await competencySearchInput.fill(firstTitleText);
      await competencySearchInput.press('Enter');
      await expect(competencySearchInput).toHaveValue(firstTitleText);
      const visibleHeadings = competencyDetailsPanel
        .locator('.competency-panel:visible .panel-heading h4 span');
      await expect(visibleHeadings.first())
        .toContainText(firstTitleText, { timeout: 20000 });
    });
  //smoke test to open first competency and verify first Learning Material link
  test('@smoke open first competency and verify first Learning Material link',
      async ({ page }) => {
      await openCourseList(page);
      const competencyDetailsPanel = await openCompetencyPanel(page);
      // Expand first competency
      const firstHeading = competencyDetailsPanel
        .locator('.competency-panel .panel-heading').first();
      await expect(firstHeading).toBeVisible({ timeout: 20000 });
      await firstHeading.click();
      const firstExpandedBody = competencyDetailsPanel
        .locator('.competency-panel .panel-collapse.in .panel-body').first();
      await expect(firstExpandedBody).toBeVisible({ timeout: 20000 });
      await expect(firstExpandedBody.getByText('Learning Materials')) .toBeVisible();
      const firstLearningMaterialLink = firstExpandedBody
        .locator('.clslearningmaterial a[href]').first();
      await expect(firstLearningMaterialLink).toBeVisible({ timeout: 20000 });
      // ✅ Get actual URL from href instead of relying on popup
      const href = await firstLearningMaterialLink.getAttribute('href');
      expect(href).toBeTruthy();
      // Validate correct pattern
      expect(href).toMatch(
        /(access-secure-file|scorm-view|competencies|uploads)/i
      );
      console.log(`✅ Learning Material link verified: ${href}`);
    }
);
 //smoke test to open first assessment View button and verify new page opens
  test('@smoke open first assessment View button and verify new page opens',
    async ({ page }) => {
      await openCourseList(page);
      const competencyDetailsPanel = await openCompetencyPanel(page);
      const firstHeading = competencyDetailsPanel
        .locator('.competency-panel .panel-heading')
        .first();
      await expect(firstHeading).toBeVisible({ timeout: 20000 });
      await firstHeading.click();
      const firstExpandedBody = competencyDetailsPanel
        .locator('.competency-panel .panel-collapse.in .panel-body')
        .first();
      await expect(firstExpandedBody).toBeVisible({ timeout: 20000 });
      await expect(firstExpandedBody.getByText('Assessments'))
        .toBeVisible();
      const firstAssessmentViewButton = firstExpandedBody
        .locator('a[href*="/assessments/view?id="] button:has-text("View")')
        .first();
      await expect(firstAssessmentViewButton)
        .toBeVisible({ timeout: 20000 });
      const [assessmentTab] = await Promise.all([
        page.waitForEvent('popup'),
        firstAssessmentViewButton.click()
      ]);
      await assessmentTab.waitForLoadState('domcontentloaded');
      await expect(assessmentTab)
        .toHaveURL(/\/assessments\/view\?id=\d+/);
      console.log(
        `✅ Assessment opened: ${assessmentTab.url()}`
      );
      await assessmentTab.close();
    });

});