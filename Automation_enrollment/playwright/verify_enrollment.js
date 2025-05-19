const { config } = require('./config');

// Utility function for retrying operations
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Retrying... Attempt ${attempt + 1} of ${maxAttempts}`);
    }
  }
}

// Debugging helpers
async function debugInputState(page, selector) {
  const state = await page.evaluate((sel) => {
    const input = document.querySelector(sel);
    if (!input) return 'Input not found';
    return {
      value: input.value,
      isVisible: input.offsetParent !== null,
      isEnabled: !input.disabled,
      isReadOnly: input.readOnly,
      type: input.type
    };
  }, selector);
  console.log('Input state:', state);
}

async function verifyInputValue(page, selector, expectedValue) {
  const actualValue = await page.evaluate((sel) => {
    const input = document.querySelector(sel);
    return input ? input.value : null;
  }, selector);
  return actualValue === expectedValue;
}

// Centralized selectors
const selectors = {
  studentManagement: ' Student Management ',
  activeStudents: {
    name: ' Active Students',
    href: '/enrolled-students/index'
  },
  pendingEnrolment: ' Pending Enrolment ',
  unpaidStudents: ' Unpaid Students ',
  newStudents: ' New Students'
};

// Centralized page elements
const getPageElements = (page) => ({
  studentManagementLink: page.getByRole('link', { name: selectors.studentManagement }),
  enrolledStudentsSearchInput: page.locator('input[name="EnrolledStudentsSearch[name]"]'),
  activeStudentsLink: page.locator('a[href="/enrolled-students/index"]'),
  courseCodeOrNameTextbox: page.getByRole('textbox', { name: 'Course Code or Name' }),
  searchButton: page.getByRole('button', { name: 'Search' }),
  enrolledStudentsSearchNameInput: page.locator('input[name="CourseStudentsSearch[student_name]"]'),
  pendingEnrolmentLink: page.getByRole('link', { name: selectors.pendingEnrolment }),
  newStudentsLink: page.getByRole('link', { name: selectors.newStudents }),
  unpaidStudentsLink: page.locator('a:has(span:text("Unpaid Students"))'),
  //unpaidStudentsLink: page.getByRole('link', { name: selectors.unpaidStudents }),
  newStudentsLinkPending: page.locator('a[href="/enrolled-students/pending-enrollment"]'),
  newStudentsLinkUnpaid: page.locator('a[href="/enrolled-students/pending-payments"]'),
  unpaidStudentsLink: page.getByRole('link', { name: selectors.unpaidStudents })
});

// Base verification function
async function verifyStudent(page, studentName, course, verificationSteps) {
  console.log(`Verifying student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);

  try {
    await retry(() => elements.studentManagementLink.click());
    await verificationSteps(page, elements, studentName);
    await verifyInActiveStudents(page, elements, studentName, course);
  } catch (error) {
    console.error('Error in student verification:', {
      message: error.message,
      studentName,
      course
    });
    await page.screenshot({ path: `verification-error-${Date.now()}.png` });
    throw error;
  }
}
// Common search and verify function with pagination handling
async function searchAndVerifyStudent(page, elements, studentName) {
  console.log(`Searching for student: ${studentName}`);
    // Find and fill the search input
  const searchInput = page.locator('input[name="EnrolledStudentsSearch[name]"]');
  await searchInput.fill(studentName);
  await page.waitForTimeout(1000); 
   // Press Enter and wait for results to load
   await searchInput.press('Enter');
   await page.waitForTimeout(2000); // Wait for results to update
   try {
    // Check all pages until student is found
    while (true) {
      // Check if student exists on current page
      const studentRow = page.locator(`tr:has-text("${studentName}")`);
      if (await studentRow.isVisible()) {
        console.log(`Found student "${studentName}"`);
        return true;
      }
      // Check if there are more pages
      const nextPage = page.locator('.pagination li a').filter({ hasText: '»' });
      const hasNextPage = await nextPage.isVisible();
      // If no more pages and student not found, break
      if (!hasNextPage) {
        break;
      }
      // Go to next page
      await nextPage.click();
      await page.waitForTimeout(2000);
    }
    // Student not found after checking all pages
    console.log(`Student "${studentName}" not found in any page`);
    return false;
  } catch (error) {
    console.error('Error while searching for student:', error);
    await page.screenshot({ path: `search-error-${Date.now()}.png` });
    throw error;
  }
}
// Enrollment confirmation function
async function confirmEnrollment(page, elements, studentName) {
  await searchAndVerifyStudent(page, elements, studentName);
  const studentRow = page.locator(`tr:has-text("${studentName}")`);
  if (await studentRow.isVisible()) {
    await studentRow.locator('.skip-export > a').first().click();
    await page.getByText('Ok', { exact: true }).click();
    console.log('---------Enrollment Confirmed-------');
  }
}

// Mark as paid function
async function markAsPaid(page, elements, studentName) {
  await searchAndVerifyStudent(page, elements, studentName);
  const studentRow = page.locator(`tr:has-text("${studentName}")`);
  if (await studentRow.isVisible()) {
    await studentRow.getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'Yes, mark as paid' }).click();
    console.log(`Successfully marked "${studentName}" as paid`);
  }
}

// Active students verification
async function verifyInActiveStudents(page, elements, studentName, course) {
  console.log('----Verifying in Active Students------');
  try {
    await elements.activeStudentsLink.waitFor({ state: 'visible' });
    
    const count = await elements.activeStudentsLink.count();
    if (count === 0) {
      throw new Error('Active Students link not found');
    }
    if (count > 1) {
      console.warn('Multiple Active Students links found - using first instance');
    }

    await retry(async () => {
      try {
        await elements.activeStudentsLink.click();
      } catch (clickError) {
        await page.evaluate(() => {
          const activeLink = document.querySelector('a[href="/enrolled-students/index"]');
          if (activeLink) activeLink.click();
        });
      }
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Fill course name and search
    await elements.courseCodeOrNameTextbox.fill(course);
    await elements.searchButton.click();
    await page.waitForTimeout(2000);

    // Find and scroll to the course link
    const courseLink = page.getByRole('link', { name: course });
    await courseLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Click course with retry
    await retry(async () => {
      try {
        await courseLink.click();
        console.log('Successfully clicked on course link');
      } catch (clickError) {
        console.log('Direct click failed, trying alternative method');
        await page.evaluate((courseName) => {
          const links = Array.from(document.querySelectorAll('a'));
          const courseLink = links.find(link => link.textContent.includes(courseName));
          if (courseLink) courseLink.click();
        }, course);
      }
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Student search with improved handling
    const studentSearchInput = page.locator('input[name="CourseStudentsSearch[student_name]"]');
    await studentSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Clear existing value
    await studentSearchInput.clear();
    await page.waitForTimeout(500);

    // Try multiple methods to fill student name
    try {
      await studentSearchInput.fill(studentName);
      await page.waitForTimeout(1000);

      if (!await verifyInputValue(page, 'input[name="CourseStudentsSearch[student_name]"]', studentName)) {
        console.log('First fill attempt failed, trying type method');
        await studentSearchInput.type(studentName, { delay: 100 });
      }

      if (!await verifyInputValue(page, 'input[name="CourseStudentsSearch[student_name]"]', studentName)) {
        console.log('Type method failed, trying JavaScript fill');
        await page.evaluate((name) => {
          const input = document.querySelector('input[name="CourseStudentsSearch[student_name]"]');
          if (input) {
            input.value = name;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, studentName);
      }

      await studentSearchInput.press('Enter');
      await page.waitForTimeout(2000);

      const studentRow = page.locator(`tr:has-text("${studentName}")`);
      await studentRow.waitFor({ state: 'visible', timeout: 10000 });
      
      const isVisible = await studentRow.isVisible();
      console.log(isVisible 
        ? `✅ "${studentName}" is found — successfully enrolled and active.`
        : `❌ "${studentName}" not found in active students.`
      );

      if (!isVisible) {
        await page.screenshot({ path: `student-not-found-${Date.now()}.png` });
      }

    } catch (error) {
      console.error('Error in student search:', error);
      await debugInputState(page, 'input[name="CourseStudentsSearch[student_name]"]');
      await page.screenshot({ path: `search-error-${Date.now()}.png` });
      throw error;
    }

  } catch (error) {
    console.error('Error verifying in Active Students:', {
      message: error.message,
      studentName,
      course
    });
    await page.screenshot({ path: `active-students-error-${Date.now()}.png` });
    throw error;
  }
}

// Verification steps for different student types
const verificationSteps = {
  manualPaid: async (page, elements, studentName) => {
    await elements.pendingEnrolmentLink.click();
    await elements.newStudentsLink.click();
    await confirmEnrollment(page, elements, studentName);
  },

  manualUnpaid: async (page, elements, studentName) => {
    try {
      // Step 1: Handle Pending Enrollment
      console.log('Step 1: Confirming enrollment');
      await elements.pendingEnrolmentLink.click();
      await page.waitForTimeout(1000);
      await elements.newStudentsLinkPending.click();
      await page.waitForTimeout(1000);
      await confirmEnrollment(page, elements, studentName);
      await page.waitForTimeout(1000);
            // Step 2: Handle Unpaid Status
      console.log('Step 2: Marking as paid');
      await elements.unpaidStudentsLink.click();
      await page.waitForTimeout(1000);
      await elements.newStudentsLinkUnpaid.click();
      await page.waitForTimeout(1000);
      await markAsPaid(page, elements, studentName);
      
      console.log('Successfully completed manual unpaid student verification');
    } catch (error) {
      console.error('Error in manual unpaid verification:', error);
      throw error;
    }
  },

  autoPaid: async (page, elements, studentName) => {
    console.log('Auto-paid student verification - direct active check');
  },

  autoUnpaid: async (page, elements, studentName) => {
    await elements.unpaidStudentsLink.click();
    await elements.newStudentsLink.click();
    await markAsPaid(page, elements, studentName);
  }
};

// Helper function to get full name
function getFullName(personal) {
  return `${personal.firstName} ${personal.lastName}`.trim();
}

// Main verification functions
async function verify_manualpaidnewstudent(page, course) {
  const personal1 = config.personal1;
  const fullName = `${personal1.firstName} ${personal1.lastName}`.trim();
  console.log('Checking manual paid new student');
  console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.manualPaid);
}

async function verify_manualunpaidnewstudent(page, course) {
  const personal2 = config.personal2;
  const fullName = `${personal2.firstName} ${personal2.lastName}`.trim();
  console.log('Checking manual unpaid new student');
  console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.manualUnpaid);
}

async function verify_autopaidnewstudent(page, course) {
  const personal3 = config.personal3;
  const fullName = `${personal3.firstName} ${personal3.lastName}`.trim();
  console.log('Checking auto-paid new student');
  console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.autoPaid);
}

async function verify_autounpaidnewstudent(page, course) {
  const personal4 = config.personal4;
  const fullName = `${personal4.firstName} ${personal4.lastName}`.trim();
  console.log('Checking auto-unpaid new student');
  console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.autoUnpaid);
}
async function verify_manualpaidnewstudent_temporary(page, course) {
  const personal1 = config.personal5;
  const fullName = `${personal1.firstName} ${personal1.lastName}`.trim();
  console.log('Checking manual paid new student');
  console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.manualPaid);
}
module.exports = {
  verify_manualpaidnewstudent,
  verify_manualunpaidnewstudent,
  verify_autopaidnewstudent,
  verify_autounpaidnewstudent,
  verify_manualpaidnewstudent_temporary
};
