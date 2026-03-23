const { test, expect } = require('@playwright/test');
const config = require('../../config/config');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const path = require('path');

test.describe('@assessment @smoke Create Assessment LQ', () => {
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

  test('@smoke Create LQ -Essay Assessment', async ({ page }) => {
     const { dashboardPage } = await openAssessmentcreateForm(page);
     await dashboardPage.selectAssessmentType('longquestion');
     await dashboardPage.selectFirstCompetency();
     await dashboardPage.enterAssessmentCode('LQ');
     await dashboardPage.enterAssessmentName('LongQ');
     await dashboardPage.enterInstruction('Please read all questions carefully before answering the assessment.');
     await dashboardPage.saveAssessmentAndVerifySuccess();
     await expect(page).toHaveURL(/updatelongquestion\?id=\d+/);
     console.log('LQ Assessment created successfully');
     await dashboardPage.clickManageQuestions();
     await dashboardPage.addQuestionType('Essay Type Question');
     await dashboardPage.enterQuestionTitle(config.assessment.questionTitles.essay);
     await dashboardPage.enterModelAnswer(config.assessment.modelAnswers.essay);
     await dashboardPage.uploadQuestionFile(config.assessment.file.sampleFile);
     await dashboardPage.saveQuestionAndVerifySuccess();
     console.log('Essay question added successfully');
     await dashboardPage.clickSave();
    
  });

  test.describe('@regression Assessment Validation Tests', () => {
    test('Validation - Code cannot be blank', async ({ page }) => {
      const { dashboardPage } = await openAssessmentcreateForm(page);
      await dashboardPage.selectAssessmentType('longquestion');
      await dashboardPage.selectFirstCompetency();
      await dashboardPage.enterAssessmentName('Test Name');
      await dashboardPage.clickSaveCompetency();
      await expect(
        page.locator('.help-block.help-block-error', { hasText: 'Code cannot be blank.' })
      ).toBeVisible();
      console.log('Validation verified: Code cannot be blank');
    });

    test('Validation - Competency cannot be blank', async ({ page }) => {
      const { dashboardPage } = await openAssessmentcreateForm(page);
      await dashboardPage.selectAssessmentType('longquestion');
      await dashboardPage.enterAssessmentCode('LQTEST');
      await dashboardPage.enterAssessmentName('Test Name');
      await dashboardPage.clickSaveCompetency();
      await expect(page.locator('li', { hasText: 'Competency cannot be blank.' })).toBeVisible();
      console.log('Validation verified: Competency cannot be blank');
    });
    test('Validation - Name cannot be blank', async ({ page }) => {
      const { dashboardPage } = await openAssessmentcreateForm(page);
      await dashboardPage.selectAssessmentType('longquestion');
      await dashboardPage.selectFirstCompetency();
      await dashboardPage.enterAssessmentCode('LQTEST');
      await dashboardPage.clickSaveCompetency();
      await expect(
        page.locator('.help-block.help-block-error', { hasText: 'Name cannot be blank.' })
      ).toBeVisible();
       console.log('Validation verified: Name cannot be blank');
    });
    test('Validation - Code invalid characters', async ({ page }) => {
      const { dashboardPage } = await openAssessmentcreateForm(page);
      await dashboardPage.selectAssessmentType('longquestion');
      await dashboardPage.selectFirstCompetency();
      await dashboardPage.enterAssessmentCode('LQ TEST@');
      await dashboardPage.enterAssessmentName('Test Name');
      await dashboardPage.clickSaveCompetency();
      await expect(
        page.locator('.help-block.help-block-error', { hasText: 'Code can only contain letters' })
      ).toBeVisible();
       console.log('Validation verified: Code invalid characters');
    });
    test('@regression Verify Question Title is required for Essay Question', async ({ page }) => {
      const { dashboardPage } = await openAssessmentcreateForm(page);
      await dashboardPage.selectAssessmentType('longquestion');
      await dashboardPage.selectFirstCompetency();
      await dashboardPage.enterAssessmentCode('LQ-NEG');
      await dashboardPage.enterAssessmentName('LongQ Negative');
      await dashboardPage.enterInstruction('Please read all questions carefully before answering the assessment.');
      await dashboardPage.saveAssessmentAndVerifySuccess();
      await expect(page).toHaveURL(/updatelongquestion\?id=\d+/);
      await dashboardPage.clickManageQuestions();
      await dashboardPage.addQuestionType('Essay Type Question');
      // ❌ Do NOT enter Question Title
      await dashboardPage.enterModelAnswer(config.assessment.modelAnswers.essay);
      await dashboardPage.uploadQuestionFile(config.assessment.file.sampleFile);
      await dashboardPage.clickSave();
      // ✅ Verify validation message
      await expect(
      page.locator('.field-questions-ques_title .help-block-error')
    ).toHaveText('Question Title cannot be blank.');
          console.log('Validation verified: Question Title cannot be blank');
        });
  });
  
});
