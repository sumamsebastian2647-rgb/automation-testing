// AssessmentPage.js
const config = require("../config");
class AssessmentPagePQ {
    constructor(page) {
        this.page = page;
        this.courseManagementLink = page.getByRole('link', { name: ' Course Management ' });
        this.assessmentsLink = page.getByRole('link', { name: ' Assessments' });
        this.createAssessmentLink = page.getByRole('link', { name: 'Create Assessment' });
        this.longqLink = page.locator('a[href="workplacepractical"]');
        this.codeInput = page.locator('#assessments-ass_code');
        this.nameInput = page.locator('#assessments-ass_name');
        this.saveButton = page.locator('button[type="submit"][class="btn btn-success btn-flat"]').first();
        this.manageObservationsButton = page.locator('a[href*="/questions/managewpquestions"][title="Manage Observations"]');
    
    }
  async saveAndWait() {
        await this.page.getByRole('button', { name: 'Save' }).first().click();
        await this.page.waitForTimeout(2000);
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
            await this.saveButton.waitFor({ state: 'visible' });
            await this.saveButton.click();
              await this.page.waitForTimeout(2000);
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    }
     async createQuestion() {
          
            await this.page.getByRole('link', { name: 'Manage Observations' }).click();
            //await this.page.locator('a.btn.btn-vk.btn-social-icon.margin-r-5.btn-flat.btn-sm[title="Manage Observations"]').first().click();
            await this.page.getByRole('link', { name: 'Add Practical Observation' }).click();
            await this.page.getByRole('paragraph').nth(1).click();
            await this.page.locator('.redactor-editor').first().type(config.paracticalQ.question);
            await this.page.locator('div:nth-child(4) > .col-md-12 > .form-group > .redactor-box > .redactor-editor').type(config.paracticalQ.answer);
            await this.page.getByRole('button', { name: 'Files' }).setInputFiles(config.paracticalQ.testfile);
            //await this.page.locator('form').filter({ hasText: 'Please fix the following' }).locator('button').click();
             await this.saveAndWait();
            await this.page.getByRole('link', { name: 'Back' }).nth(1).click();
            await this.page.getByRole('link', { name: 'Back' }).click();

 

    }
    
      
}

module.exports = { AssessmentPagePQ };
