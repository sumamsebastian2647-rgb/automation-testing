const { test, expect, chromium } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('../auth');
const { expandFormsMenu, generateEnrollmentLink } = require('../generatelink');
const { fetchOtpWithRetry } = require('../fetchOtpFromMailinator');
const { config } = require('../config');
const {
  fillPersonalDetails1,
  fillPersonalDetails2,
  fillPersonalDetails3,
  fillPersonalDetails4,
  fillPersonalDetails5,
  fillResidentialDetails,
  fillContactInformation,
  fillEmployerDetails,
  fillPreCourseEvaluation,
  rpl,
  fillStudentIdentifiers,
  uploadDocuments,
  fillDeclarationAndSignature,
  completePayment_paid,
  completePayment_unpaid
} = require('../enrollment_steps');
const {
 verify_manualpaidnewstudent_temporary
} = require('../verify_enrollment.js');

test('Enroll temporary student and complete successfully', async () => {
  test.setTimeout(6000000);

  // Manually launch browser
  let browser = await chromium.launch({ headless: false });
  let context = await browser.newContext();
  let page = await context.newPage();

  const courseone = config.courselistexisting.course1_existing;
  const coursetwo = config.courselistexisting.course2_existing;
  const coursethree = config.courselistexisting.course3_existing;
  const coursefour = config.courselistexisting.course4_existing;

  // Read link directly from config
  const enrollmentLink = config.generatelinkexisting.manualacceptancelink1_existing;
  console.log(enrollmentLink);
  const emailis = config.personal5.email;
  console.log(emailis);
  // Begin Enrollment - First Session
  await page.goto(enrollmentLink);
  await fillPersonalDetails5(page);
  //await fillResidentialDetails(page);

  // Close browser
  await browser.close();
  console.log('Ended');

  // Reopen browser
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  await page.goto(enrollmentLink);
  await fillPersonalDetails5(page);

  // Handle OTP
  await page.waitForTimeout(10000);
  await page.getByRole('textbox', { name: 'Enter the 6-digit' }).click();
  const otp = await fetchOtpWithRetry(emailis, 3, 10000);
  expect(otp).not.toBeNull();
  console.log(`✅ OTP received: ${otp}`);
  await page.getByRole('textbox', { name: 'Enter the 6-digit' }).fill(otp);
  await page.getByRole('button', { name: 'Start Fresh Application' }).click();
  await page.getByRole('button', { name: 'Yes, delete it!' }).click();
  await page.getByRole('button', { name: 'OK' }).click();

  // Continue Enrollment
  await fillPersonalDetails5(page);
  await fillResidentialDetails(page);
  await fillContactInformation(page);
  await fillEmployerDetails(page);
  await fillPreCourseEvaluation(page);
  await rpl(page);
  await fillStudentIdentifiers(page);
  await uploadDocuments(page);
  await fillDeclarationAndSignature(page);
  await completePayment_paid(page);

  // Final Verification Steps
  await page.reload();
  await loginAsAdmin(page);
  await verify_manualpaidnewstudent_temporary(page, courseone);
  await logoutAsAdmin(page);
  await page.reload();

  // Final browser close (optional)
  await browser.close();
});
