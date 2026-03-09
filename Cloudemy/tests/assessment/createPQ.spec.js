const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const path = require('path');

test.describe('@assessment @smoke @regression Create Assessment PQ', () => {
  async function openAssessmentcreateForm(page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto(config.credentials.baseURL);
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    await dashboardPage.navigateToAssessmentList();
    await dashboardPage.clickCreateAssessment();
    await expect(page).toHaveURL(/assessments\/selecttype/);

    return { dashboardPage };
  }

  test('@smoke Create PQ Assessment', async ({ page }) => {
     const { dashboardPage } = await openAssessmentcreateForm(page);
     await dashboardPage.selectAssessmentType('workplacepractical');
     await dashboardPage.selectFirstCompetency();
     await dashboardPage.enterAssessmentCode('PQ');
    await dashboardPage.enterAssessmentName('PRQ');
    await dashboardPage.enterInstruction('Please read all questions carefully before answering the assessment.');
    await dashboardPage.saveAssessmentAndVerifySuccesspq();
    await expect(page).toHaveURL(/updateworkplacepractical\?id=\d+/);
    console.log('PQ Assessment created successfully');
    await dashboardPage.clickManageQuestionsPQ();
    await dashboardPage.clickAddPracticalObservation();
    await dashboardPage.enterQuestionTitle(config.assessment.questionTitles.essay);
         await dashboardPage.enterModelAnswer(config.assessment.modelAnswers.essay);
         await dashboardPage.uploadQuestionFile(config.assessment.file.sampleFile);
         await dashboardPage.saveQuestionAndVerifySuccesspq();
          console.log('PQ question added successfully');
          await dashboardPage.clickSave();     
  });
  
});
