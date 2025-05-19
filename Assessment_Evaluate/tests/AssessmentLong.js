const config = require("../config");

// AssessmentPage.js
class AssessmentPageLQ {
    constructor(page) {
        this.page = page;
        this.courseManagementLink = page.getByRole('link', { name: ' Course Management ' });
        this.assessmentsLink = page.getByRole('link', { name: ' Assessments' });
        this.createAssessmentLink = page.getByRole('link', { name: 'Create Assessment' });
        this.longqLink = page.locator('a[href="longquestion"]');
        this.codeInput = page.locator('#assessments-ass_code');
        this.nameInput = page.locator('#assessments-ass_name');
        this.saveButton = page.locator('.box-footer button[type="submit"]');
    }

    async createNewAssessment(assessmentData) {
        try {
            await this.page.getByRole('link', { name: ' Course Management ' }).click();
            await this.page.getByRole('link', { name: ' Course Management ' }).click();
            await this.page.getByRole('link', { name: ' Assessments' }).click();
            await this.page.getByRole('link', { name: 'Create Assessment' }).click();
            await this.page.waitForTimeout(1000);
            await this.longqLink.click();
            await this.page.waitForLoadState('networkidle');
            await this.page.locator('#select2-assessments-ass_comp_id-container').click();
            await this.page.getByRole('option', { name: 'ACMEXH304 - ASSIST WITH' }).click();
            
            await this.codeInput.waitFor({ state: 'visible' });
            await this.codeInput.fill(assessmentData.code);
            await this.nameInput.waitFor({ state: 'visible' });
            await this.nameInput.fill(assessmentData.name);
            await this.page.locator('.redactor-editor').first().fill(assessmentData.description);
            await this.page.waitForTimeout(1000);
            await this.saveButton.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    }
    async createQuestion() {
    await this.page.getByRole('link', { name: 'Manage Questions' }).click();
    //await this.page.locator('a[title="Manage Questions"]').first().click();
    await this.page.getByRole('button', { name: 'Create Questions   ' }).click();
    await this.page.getByRole('link', { name: 'Essay Type Question' }).click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.redactor-editor').first().click();
    await this.page.locator('.redactor-editor').first().type(config.longanswer_essay.question1);
    const secondEditor = this.page.locator('.redactor-editor').nth(1);
    await secondEditor.scrollIntoViewIfNeeded();
    await secondEditor.click();
    await secondEditor.type(config.longanswer_essay.answer1);
    await this.page.getByRole('button', { name: 'Files' }).setInputFiles(config.longanswer_essay.file1);
    await this.page.waitForTimeout(1000);
    await this.page.evaluate(() => window.scrollBy(0, 500)); // Scrolls down 500px
    await this.page.locator('#btnSubmit').click();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Add New Question ' }).click();
    await this.page.getByRole('link', { name: 'Essay Type Question' }).click();
    await this.page.locator('.redactor-editor').first().click();
    await this.page.locator('.redactor-editor').first().type(config.longanswer_essay.question2);
    const secondEditor1 = this.page.locator('.redactor-editor').nth(1);
    await secondEditor1.scrollIntoViewIfNeeded();
    await secondEditor1.click();
    await secondEditor1.type(config.longanswer_essay.answer2);
    await this.page.locator('#btnSubmit').click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('paragraph').filter({ hasText: 'Back' }).getByRole('link').click();
    await this.page.getByRole('link', { name: 'Back' }).click();
    }
      
}

module.exports = { AssessmentPageLQ };
