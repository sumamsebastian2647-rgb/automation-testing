const config = require('../config/config');
const { expect } = require('@playwright/test');

class QuestionsPage {
    constructor(page) {
        this.page = page;

        // ✅ Locators reused
        this.saveCompetencyButton = this.page.locator(
            'div.box-footer > button[type="submit"].btn.btn-success.btn-flat'
        );
    }

    /* ===============================
       🔵 Utility Methods (Improved)
    =============================== */

    async waitAndClick(locator) {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.scrollIntoViewIfNeeded();
        await locator.click({ force: true });
    }

    async safeType(locator, text) {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click({ force: true });
        await locator.fill(text);
    }

    async fillEditor(selector, text) {
        const editor = this.page.locator(selector);
        await editor.waitFor({ state: 'visible', timeout: 15000 });
        await editor.click({ force: true });
        await editor.fill(text);
    }

    /* ===============================
       🔵 Common Actions
    =============================== */

    async clickCreateQuestions() {
        const btn = this.page.locator('button.btn-info:has-text("Create Questions")');
        await this.waitAndClick(btn);
    }

    async clickManageQuestions() {
        const link = this.page.getByTitle('Manage Questions');
        await this.waitAndClick(link);
    }

   async clickAddNewQuestion() {
    const btn = this.page.getByRole('button', { name: 'Add New Question' });

    await btn.waitFor({ state: 'visible', timeout: 15000 });

    // Scroll page to bottom to ensure dropdown button is visible
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    //await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
}

    async saveAndWait() {
    await expect(this.saveCompetencyButton).toBeVisible({ timeout: 15000 });

    await Promise.all([
        this.page.waitForLoadState('domcontentloaded'),
        this.saveCompetencyButton.click({ force: true })
    ]);

    // ensure page fully ready
    await this.page.waitForLoadState('networkidle');

    // small UI stabilization
    await this.page.waitForTimeout(500);
}

    /* ===============================
       🔵 Fill Common Fields
    =============================== */

    async fillCommonFields(questionText, correctFeedback, wrongFeedback) {
        const editors = this.page.locator('.redactor-editor');

        await editors.nth(0).waitFor({ state: 'visible', timeout: 15000 });
        await editors.nth(0).fill(questionText);

        await editors.nth(1).fill(correctFeedback);
        await editors.nth(2).fill(wrongFeedback);
    }

    /* =====================================================
       🔴 QUESTION TYPES (Improved for Headless Stability)
    ===================================================== */

    async createMultipleChoiceQuestion() {
        const data = config.testData.questions.multipleChoice;

        try {
            await this.page.getByRole('link', { name: 'Multiple choice' }).click();
             const textarea = this.page.locator('#questions-ques_title');
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);

            await this.fillEditor(
                'div:nth-child(5) .redactor-editor',
                data.answer
            );
            await textarea.evaluate((el, value) => {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, data.question);
            // Add Options safely
            const option0 = this.page.locator('textarea[name*="[answer][new][0]"]');
            const option1 = this.page.locator('textarea[name*="[answer][new][1]"]');

            await this.safeType(option0, data.options1);
            await this.safeType(option1, data.option2);
const checkbox = this.page.locator('input[name="QuestionMultipleChoiceAnswer[right_answer][new][0]"]');

await checkbox.waitFor({ state: 'attached' });
await checkbox.locator('..').click();
            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed to create multiple choice question:', error);
            throw error;
        }
    }

    async createShortAnswerQuestion() {
        const data = config.testData.questions.shortAnswer;
        try {
            await this.clickAddNewQuestion();
            //await this.page.getByRole('link', { name: 'Short Answer Question' }).click();
              await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.page.getByRole('link', { name: 'Short Answer Question' }).click()
    ]);
            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);
 const textarea = this.page.locator('#questions-ques_title');
            await this.fillEditor(
                'div:nth-child(5) .redactor-editor',
                data.answer
            );
await textarea.evaluate((el, value) => {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, data.question);
            await this.safeType(this.page.locator('#txtAnswer0'), data.answer);

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed to create short answer question:', error);
            throw error;
        }
    }

    async createFillInBlankQuestion() {
        const data = config.testData.questions.fillInBlank;

        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Fill in the blank', exact: true }).click();

            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);

            await this.fillEditor('div:nth-child(6) .redactor-editor', data.answer);

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed Fill In Blank:', error);
            throw error;
        }
    }

    async createSmartFillInBlankQuestion() {
        const data = config.testData.questions.smartFillInBlank;

        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Smart fill in the blank' }).click();

            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);

            await this.fillEditor('div:nth-child(6) .redactor-editor', data.answer);

            await this.page.waitForTimeout(1000); // small UI stabilization

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed Smart Fill:', error);
            throw error;
        }
    }

    async createTrueFalseQuestion() {
        const data = config.testData.questions.trueFalse;

        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'True False' }).click();

            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);

            await this.fillEditor('div:nth-child(5) .redactor-editor', data.answer);

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed True/False:', error);
            throw error;
        }
    }

    async createMatchingQuestion() {
        const data = config.testData.questions.matching;

        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Matching' }).click();

            const editors = this.page.locator('.redactor-editor');

            await editors.nth(0).fill(data.question);
            await editors.nth(1).fill(data.correctFeedback);
            await editors.nth(2).fill(data.wrongFeedback);
            await editors.nth(3).fill(data.answer);

            await this.safeType(
                this.page.locator('textarea[name*="Answer"]'),
                data.answer
            );

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed Matching:', error);
            throw error;
        }
    }

    async createDragAndDropQuestion() {
        const data = config.testData.questions.dragAndDrop;

        try {
            await this.clickAddNewQuestion();
            await this.page.getByRole('link', { name: 'Drag & Drop' }).click();

            await this.fillCommonFields(data.question, data.correctFeedback, data.wrongFeedback);

            await this.fillEditor('div:nth-child(6) .redactor-editor', data.answer);

            await this.saveAndWait();
        } catch (error) {
            console.error('❌ Failed Drag & Drop:', error);
            throw error;
        }
    }

    async createAllQuestions() {
        try {
            await this.clickManageQuestions();
            await this.clickCreateQuestions();

            await this.createMultipleChoiceQuestion();
            await this.createShortAnswerQuestion();
            await this.createFillInBlankQuestion();
            await this.createSmartFillInBlankQuestion();
            await this.createTrueFalseQuestion();
            await this.createMatchingQuestion();
            await this.createDragAndDropQuestion();
        } catch (error) {
            console.error('❌ Error in createAllQuestions:', error);
            throw error;
        }
    }

    async clickSaveCompetency() {
        await expect(this.saveCompetencyButton).toBeVisible({ timeout: 15000 });
        await this.saveCompetencyButton.click({ force: true });
    }
}

module.exports = { QuestionsPage };