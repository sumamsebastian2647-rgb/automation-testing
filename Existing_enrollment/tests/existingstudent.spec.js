const { test, expect } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('../auth');
const { fetchOtpWithRetry } = require('../fetchOtpFromMailinator');
const { config } = require('../config');
const {
    fillPersonalDetails1,
    fillPersonalDetails2,
    fillPersonalDetails3,
    fillPersonalDetails4,
    completePayment_paid,
    completePayment_unpaid
} = require('../enrollment_steps');
const {
    verify_manualpaidnewstudent,
    verify_manualunpaidnewstudent,
    verify_autopaidnewstudent,
    verify_autounpaidnewstudent
} = require('../verify_enrollment_existing.js');

// Add the new checkExistingEnrollment function
async function checkExistingEnrollment(page) {
    try {
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        const errorMessage = await page.locator('.swal2-html-container')
            .filter({ hasText: 'You have already enrolled in this course' });

        if (await errorMessage.isVisible()) {
            console.log('\n❌ Enrollment already exists');
            
            await page.screenshot({ 
                path: `enrollment-exists-${Date.now()}.png`,
                fullPage: true 
            });

            const tryAgainButton = page.locator('button.swal2-confirm.swal2-styled');
            await tryAgainButton.click();
            
            console.log('🛑 Process ended due to existing enrollment\n');
            return true;
        }
        return false;
    } catch (error) {
        console.log('Error checking enrollment:', error.message);
        return false;
    }
}

// Utility Functions
async function handleOTPVerification(page, email) {
    await page.getByRole('textbox', { name: 'Enter the 6-digit' }).click();
    const otp = await fetchOtpWithRetry(email, 3, 10000);
    expect(otp).not.toBeNull();
    console.log(`✅ OTP received: ${otp}`);
    await page.getByRole('textbox', { name: 'Enter the 6-digit' }).fill(otp);
    await page.getByRole('button', { name: ' Verify & Continue' }).click();
    await page.click('.swal2-confirm.swal2-styled');
}

async function navigateFormSteps(page) {
    const steps = 8;
    for (let i = 0; i < steps; i++) {
        await page.getByRole('button', { name: 'Next' }).click();
        await page.waitForTimeout(i < 5 ? config.timeouts.short : config.timeouts.medium);
    }
}

async function completeEnrollmentProcess(page, {
    enrollmentLink,
    email,
    fillPersonalDetails,
    completePayment,
    verifyFunction,
    course
}) {
    console.log(enrollmentLink);
    await page.goto(enrollmentLink);

    // First check for existing enrollment
    const isEnrolled = await checkExistingEnrollment(page);
    if (isEnrolled) {
        console.log('Skipping enrollment process due to existing enrollment');
        return;
    }

    // Continue with regular enrollment process
    await fillPersonalDetails(page);
    await handleOTPVerification(page, email);
    await navigateFormSteps(page);
    await completePayment(page);
    await page.reload();
    await loginAsAdmin(page);
    await verifyFunction(page, course);
    await logoutAsAdmin(page);
    await page.reload();
}

/*test('Enroll existing student and complete successfully', async ({ page }) => {
    test.setTimeout(3000000);

    const enrollmentScenarios = [
        {
            name: 'Manual acceptance with payment',
            enrollmentLink: config.generatelinkexisting.manualacceptancelink1_existing,
            email: config.personal1.email,
            fillPersonalDetails: fillPersonalDetails1,
            completePayment: completePayment_paid,
            verifyFunction: verify_manualpaidnewstudent,
            course: config.courselistexisting.course1_existing
        },
        {
            name: 'Manual acceptance without payment',
            enrollmentLink: config.generatelinkexisting.manualacceptancelink2_existing,
            email: config.personal2.email,
            fillPersonalDetails: fillPersonalDetails2,
            completePayment: completePayment_unpaid,
            verifyFunction: verify_manualunpaidnewstudent,
            course: config.courselistexisting.course2_existing
        },
        {
            name: 'Auto acceptance with payment',
            enrollmentLink: config.generatelinkexisting.autoacceptancelink1_existing,
            email: config.personal3.email,
            fillPersonalDetails: fillPersonalDetails3,
            completePayment: completePayment_paid,
            verifyFunction: verify_autopaidnewstudent,
            course: config.courselistexisting.course3_existing
        },
        {
            name: 'Auto acceptance without payment',
            enrollmentLink: config.generatelinkexisting.autoacceptancelink2_existing,
            email: config.personal4.email,
            fillPersonalDetails: fillPersonalDetails4,
            completePayment: completePayment_unpaid,
            verifyFunction: verify_autounpaidnewstudent,
            course: config.courselistexisting.course4_existing
        }
    ];

    for (const scenario of enrollmentScenarios) {
        console.log(`Starting enrollment scenario: ${scenario.name}`);
        await completeEnrollmentProcess(page, scenario);
        console.log(`Completed enrollment scenario: ${scenario.name}`);
    }
});
*/