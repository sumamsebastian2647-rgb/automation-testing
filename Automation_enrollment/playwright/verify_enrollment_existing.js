const { config } = require('./config');

// Utility function for waiting and filling input
async function fillAndPressEnter(locator, value) {
    await locator.click();
    await locator.fill(value);
    await locator.press('Enter');
}

// Navigation functions
async function navigateToStudentManagement(page) {
    await page.getByRole('link', { name: ' Student Management ' }).click();
}

async function navigateToPendingEnrollment(page) {
    await navigateToStudentManagement(page);
    await page.getByRole('link', { name: ' Pending Enrolment ' }).click();
    await page.locator('a[href="/enrolled-students/existing-student-pending-enrollment"]').click();
}

async function navigateToUnpaidStudents(page) {
    await page.getByRole('link', { name: ' Unpaid Students ' }).click();
    await page.locator('a[href="/enrolled-students/existing-unpaid-student"]').click();
}

// Core functionality functions
async function searchAndConfirmEnrollment(page, studentname) {
    try {
        const searchSelector = 'input[name="ExistingStudentCourseInquirySearch[student_id]"]';
        await page.waitForSelector(searchSelector, { state: 'visible', timeout: 5000 });
        
        await page.click(searchSelector);
        await page.fill(searchSelector, studentname);
        await page.press(searchSelector, 'Enter');
        
        await page.waitForTimeout(2000);
        
        const studentRow = page.locator(`tr:has-text("${studentname}")`);
        if (await studentRow.isVisible()) {
            console.log(`Student "${studentname}" found`);
            await studentRow.locator('.skip-export > a').first().click();
            await page.getByText('Ok', { exact: true }).click();
            console.log('---------Enrollment Confirmed');
        } else {
            console.log(`Student "${studentname}" not found — skipping enrolment step.`);
        }
    } catch (error) {
        console.error(`Error in searchAndConfirmEnrollment: ${error.message}`);
        throw error;
    }
}

async function searchStudent(page, studentname) {
    const nameInput = page.locator('input[name="CourseStudentsSearch[student_name]"]');
    await fillAndPressEnter(nameInput, studentname);
    await page.waitForLoadState('networkidle');
}

async function markStudentAsPaid(page, studentname) {
    const unpaidRow = page.locator(`tr:has-text("${studentname}")`);
    if (await unpaidRow.isVisible()) {
        await page.waitForSelector(`tr:has-text("${studentname}")`, { timeout: config.timeouts.short });
        console.log(`Unpaid student "${studentname}" found — marking as paid.`);
        await unpaidRow.getByRole('button').nth(1).click();
        await page.getByRole('button', { name: 'Yes, mark as paid' }).click();
    } else {
        console.log(`Unpaid student "${studentname}" not found — skipping payment step.`);
    }
}

async function verifyActiveStudent(page, course, studentname) {
    // Use specific href selector for Active Students
    await page.locator('a[href="/enrolled-students/index"]').click();
    
    // Updated: Course search with better waiting and verification
    const courseSearchInput = 'input[name="CourseSearch[c_code]"]';
    await page.waitForSelector(courseSearchInput, { state: 'visible', timeout: 5000 });
    await page.fill(courseSearchInput, course);
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for the search results to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Add small delay to ensure results are loaded
    
    // Updated: More robust course selection
    try {
        // First try with exact name match
        const courseLink = page.locator(`a:has-text("${course}")`).first();
        await courseLink.waitFor({ state: 'visible', timeout: 5000 });
        await courseLink.click();
    } catch (error) {
        console.log(`Trying alternative course selection method for: ${course}`);
        // Try finding the course in the table
        const courseRow = page.locator(`tr:has-text("${course}")`);
        await courseRow.waitFor({ state: 'visible', timeout: 5000 });
        await courseRow.locator('a').first().click();
    }
    
    // Wait for the course page to load
    await page.waitForLoadState('networkidle');
    
    // Search for student
    await searchStudent(page, studentname);
    
    // Verify student presence
    const activeRow = page.locator(`tr:has-text("${studentname}")`);
    await page.waitForSelector(`tr:has-text("${studentname}")`, { timeout: config.timeouts.medium });
    
    if (await activeRow.isVisible()) {
        console.log(`✅ "${studentname}" is found — successfully enrolled and active.`);
    } else {
        console.log(`❌ "${studentname}" not found in active students.`);
    }
}

// Main verification functions
async function verify_manualpaidnewstudent(page, course) {
    const studentname = config.personal1.firstName;
    console.log(course, studentname);
    
    await navigateToPendingEnrollment(page);
    await searchAndConfirmEnrollment(page, studentname);
    await verifyActiveStudent(page, course, studentname);
}

async function verify_manualunpaidnewstudent(page, course) {
    const studentname = config.personal2.firstName;
    console.log(course, studentname);
    
    await navigateToPendingEnrollment(page);
    await searchAndConfirmEnrollment(page, studentname);
    
    await navigateToUnpaidStudents(page);
    await searchStudent(page, studentname);
    await markStudentAsPaid(page, studentname);
    await verifyActiveStudent(page, course, studentname);
}

async function verify_autopaidnewstudent(page, course) {
    const studentname = config.personal3.firstName;
    console.log(course, studentname);
    
    await navigateToStudentManagement(page);
    await verifyActiveStudent(page, course, studentname);
}

async function verify_autounpaidnewstudent(page, course) {
    const studentname = config.personal4.firstName;
    console.log(course, studentname);
    
    await navigateToStudentManagement(page);
    await navigateToUnpaidStudents(page);
    await searchStudent(page, studentname);
    await markStudentAsPaid(page, studentname);
    await verifyActiveStudent(page, course, studentname);
}

module.exports = {
    verify_manualpaidnewstudent,
    verify_manualunpaidnewstudent,
    verify_autopaidnewstudent,
    verify_autounpaidnewstudent   
};
