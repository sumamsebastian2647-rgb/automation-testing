// AssessmentPage.js
class AssessmentPagePQ {
    constructor(page) {
        this.page = page;
        this.courseManagementLink = page.getByRole('link', { name: ' Course Management ' });
        this.assessmentsLink = page.getByRole('link', { name: ' Assessments' });
        this.createAssessmentLink = page.getByRole('link', { name: 'Create Assessment' });
        this.longqLink = page.locator('a[href="workplacepractical"]');
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
            //await this.page.locator('form').filter({ hasText: 'Type: Automatic Marking' }).locator('button').click();
             // Click the save button in box-footer
            await this.saveButton.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    }
    async createQuestiont(assessmentData) {
    }
      
}

module.exports = { AssessmentPagePQ };
