// testsuit.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./LoginPage');
const { AssessmentPage } = require('./AssessmentAQ');
const { AssessmentPageLQ } = require('./AssessmentLong');
const { AssessmentPageHQ } = require('./AssessmentHQ');
const { AssessmentPagePQ } = require('./AssessmentPQ');
const { AssessmentPageScrom } = require('./AssessmentScrom');
const config = require('../config');

test.setTimeout(120000); 
test.describe('Assessment Creation Suite', () => {
    /* test('Create Long Answer Assessment', async ({ page }) => {
        try {
            const loginPage = new LoginPage(page);
            await loginPage.login(config.credentials.username, config.credentials.password);
            const assessmentPage = new AssessmentPageLQ(page);
            await assessmentPage.createNewAssessment({
                code: config.assessment_code.LQcode,
                name: config.assessment_name.LQname,
                description: config.assessment_instr.instrcution
            });
            await assessmentPage.createQuestion(page)
        } catch (error) {
            console.error('Test failed:', error);

            if (page && !page.isClosed()) {
                await page.screenshot({ path: `test-failure-${Date.now()}.png` });
            }
            throw error;
        }
    });*/
   test('Create Automatic Assessment', async ({ page }) => {
        try {
            const loginPage = new LoginPage(page);
            await loginPage.login(config.credentials.username, config.credentials.password);
            const assessmentPage = new AssessmentPage(page);
            await assessmentPage.createNewAssessment({
                code: config.assessment_code.AQcode,
                name: config.assessment_name.AQname,
                description: config.assessment_instr.instrcution
            });
            await assessmentPage.createQuestion()
            } catch (error) {
            console.error('Test failed:', error);
            if (page && !page.isClosed()) {
                await page.screenshot({ path: `test-failure-${Date.now()}.png` });
            }
            throw error;
        }
    });
   
    /*test('Create Hybrid Answer Assessment', async ({ page }) => {
        try {
            const loginPage = new LoginPage(page);
            await loginPage.login(config.credentials.username, config.credentials.password);
            const assessmentPage = new AssessmentPageHQ(page);
            await assessmentPage.createNewAssessment({
                code: config.assessment_code.HQcode,
                name: config.assessment_name.HQname,
                description: config.assessment_instr.instrcution
            });
        } catch (error) {
            console.error('Test failed:', error);
            if (page && !page.isClosed()) {
                await page.screenshot({ path: `test-failure-${Date.now()}.png` });
            }
            throw error;
        }
    });
     test('Create Practical Answer Assessment', async ({ page }) => {
        try {
            const loginPage = new LoginPage(page);
            await loginPage.login(config.credentials.username, config.credentials.password);
            const assessmentPage = new AssessmentPagePQ(page);
            await assessmentPage.createNewAssessment({
                code: config.assessment_code.PQcode,
                name: config.assessment_name.PQname,
                description: config.assessment_instr.instrcution
            });
        } catch (error) {
            console.error('Test failed:', error);
            if (page && !page.isClosed()) {
                await page.screenshot({ path: `test-failure-${Date.now()}.png` });
            }
            throw error;
        }
    });
    test('Create SCROM Assessment', async ({ page }) => {
        try {
            const loginPage = new LoginPage(page);
            await loginPage.login(config.credentials.username, config.credentials.password);
            const assessmentPage = new AssessmentPageScrom(page);
            await assessmentPage.createNewAssessment({
                code: config.assessment_code.Scromcode,
                name: config.assessment_name.Scromname,
            });
        } catch (error) {
            console.error('Test failed:', error);
            if (page && !page.isClosed()) {
                await page.screenshot({ path: `test-failure-${Date.now()}.png` });
            }
            throw error;
        }
    });*/  

});
