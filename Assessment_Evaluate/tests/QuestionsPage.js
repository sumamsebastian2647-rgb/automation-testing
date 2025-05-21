const config = require('../config');

class QuestionsPage {
    constructor(page) {
        this.page = page;
    }

    async waitAndClick(selector) {
        await this.page.waitForSelector(selector);
        await this.page.click(selector);
    }

    async fillEditor(selector, text) {
        await this.page.locator(selector).click();
        await this.page.locator(selector).type(text);
    }

    async fillCommonFields(questionText, correctFeedback, wrongFeedback) {
    await this.page.locator('.redactor-editor').nth(0).type(questionText);
    await this.page.locator('.redactor-editor').nth(1).type(correctFeedback);
    await this.page.locator('.redactor-editor').nth(2).type(wrongFeedback);
    }

    async saveAndWait() {
        await this.page.getByRole('button', { name: 'Save' }).first().click();
        await this.page.waitForTimeout(2000);
    }

    async clickCreateQuestions() {
        await this.page.locator('button.btn-info:has-text("Create Questions")').click();
    }

    async clickAddNewQuestion() {
        await this.page.getByRole('button', { name: 'Add New Question ' }).click();
    }

    async createMultipleChoiceQuestion() {
        const data = config.testData.questions.multipleChoice;
        try {
            await this.page.getByRole('link', { name: 'Multiple choice' }).click();
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
            
            await this.fillEditor('div:nth-child(5) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
            
            await this.page.locator('#option0').getByRole('insertion').click();
            await this.page.locator('textarea[name="QuestionMultipleChoiceAnswer\\[answer\\]\\[new\\]\\[0\\]"]').click();
            await this.page.locator('textarea[name="QuestionMultipleChoiceAnswer\\[answer\\]\\[new\\]\\[0\\]"]').fill(data.options1);
            await this.page.locator('textarea[name="QuestionMultipleChoiceAnswer\\[answer\\]\\[new\\]\\[1\\]"]').click();
            await this.page.locator('textarea[name="QuestionMultipleChoiceAnswer\\[answer\\]\\[new\\]\\[1\\]"]').fill(data.option2);
                        
            await this.saveAndWait();
        } catch (error) {
            console.error('Failed to create multiple choice question:', error);
            throw error;
        }
    }

    async createShortAnswerQuestion() {
        const data = config.testData.questions.shortAnswer;
        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Short Answer Question' }).click();
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
            
            await this.fillEditor('div:nth-child(5) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
            await this.page.locator('#txtAnswer0').fill(data.answer);
            
            await this.saveAndWait();
        } catch (error) {
            console.error('Failed to create short answer question:', error);
            throw error;
        }
    }

    async createFillInBlankQuestion() {
    const data = config.testData.questions.fillInBlank;
    try {
        await this.clickAddNewQuestion();
        await this.page.getByRole('link', { name: 'Fill in the blank', exact: true }).click();
        await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
        
        await this.fillEditor('div:nth-child(6) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
        
        await this.saveAndWait();
    } catch (error) {
        console.error('Failed to create fill in blank question:', error);
        throw error;
    }
   }

    async createSmartFillInBlankQuestion() {
        const data = config.testData.questions.smartFillInBlank;
        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Smart fill in the blank' }).click();
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
            
            await this.fillEditor('div:nth-child(6) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
            await this.page.waitForTimeout(2000);
            
            await this.saveAndWait();
        } catch (error) {
            console.error('Failed to create smart fill in blank question:', error);
            throw error;
        }
    }

    async createTrueFalseQuestion() {
        const data = config.testData.questions.trueFalse;
        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'True False' }).click();
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
            
            await this.fillEditor('div:nth-child(5) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
            
            await this.saveAndWait();
        } catch (error) {
            console.error('Failed to create true/false question:', error);
            throw error;
        }
    }
async createMatchingQuestion() {
    const data = config.testData.questions.matching;
    try {
        await this.clickAddNewQuestion();
        await this.page.getByRole('link', { name: 'Matching' }).click();
        await this.page.locator('.redactor-editor').nth(0).type(data.question);
        await this.page.locator('.redactor-editor').nth(1).type(data.correctFeedback);
        await this.page.locator('.redactor-editor').nth(2).type(data.wrongFeedback);
            
        await this.page.locator('.redactor-editor').nth(3).type(data.answer);
        await this.page.locator('#option0').getByRole('paragraph').click();
         await this.page.locator('.form-group > .form-group > .redactor-box > .redactor-editor').type(data.question);
        await this.page.getByRole('textbox', { name: 'Answer*' }).click();
         await this.page.getByRole('textbox', { name: 'Answer*' }).fill(data.answer);
    
       
        await this.saveAndWait();
    } catch (error) {
        console.error('Failed to create matching question:', error);
        throw error;
    }
}

    

    async createDragAndDropQuestion() {
        const data = config.testData.questions.dragAndDrop;
        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Drag & Drop' }).click();
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
            
            await this.fillEditor('div:nth-child(6) > .col-md-12 > .form-group > .redactor-box > .redactor-editor', data.answer);
            
            await this.saveAndWait();
        } catch (error) {
            console.error('Failed to create drag and drop question:', error);
            throw error;
        }
    }

    async createAllQuestions() {
        try {
            // First click Create Questions dropdown
            await this.clickCreateQuestions();
            await this.createMultipleChoiceQuestion();
            await this.createShortAnswerQuestion();
            await this.createFillInBlankQuestion();
            await this.createSmartFillInBlankQuestion();
            await this.createTrueFalseQuestion();
            await this.createMatchingQuestion();
            await this.createDragAndDropQuestion();
            await this.page.locator('a.btn-flat.btn-google[href*="manageaqquestions"]').first().click();
            } catch (error) {
            console.error('Error in createAllQuestions:', error);
            throw error;
        }
    }
}

module.exports = { QuestionsPage };
