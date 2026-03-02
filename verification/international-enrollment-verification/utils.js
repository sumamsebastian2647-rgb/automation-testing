/**
 * Verification utility functions
 * @module verification/utils
 */

const { config } = require('../../config/config.js');

/**
 * Utility function for retrying operations
 * @param {Function} fn - Function to retry
 * @param {number} [maxAttempts=3] - Maximum number of retry attempts
 * @param {number} [delay=1000] - Delay between retries in milliseconds
 * @returns {Promise<any>}
 */
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

/**
 * Debug input state for troubleshooting
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the input
 * @returns {Promise<void>}
 */
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

/**
 * Verify input value matches expected value
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the input
 * @param {string} expectedValue - Expected value
 * @returns {Promise<boolean>}
 */
async function verifyInputValue(page, selector, expectedValue) {
  const actualValue = await page.evaluate((sel) => {
    const input = document.querySelector(sel);
    return input ? input.value : null;
  }, selector);
  return actualValue === expectedValue;
}

/**
 * Centralized selectors
 */
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

/**
 * Get page elements for verification
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Object} Page elements
 */
const getPageElements = (page) => ({
  studentManagementLink: page.locator('li#student_management:has(a span:text("Student Management"))'),
  enrolledStudentsSearchInput: page.locator('input[name="EnrolledStudentsSearch[name]"]'),
  activeStudentsLink: page.locator('a[href="/enrolled-students/index"]'),
  courseCodeOrNameTextbox: page.locator('#coursesearch-c_name'),
  searchButton: page.getByRole('button', { name: 'Search' }),
  enrolledStudentsSearchNameInput: page.locator('input[name="CourseStudentsSearch[student_name]"]'),
  pendingEnrolmentLink: page.getByRole('link', { name: selectors.pendingEnrolment }),
  newStudentsLink: page.getByRole('link', { name: selectors.newStudents }),
  unpaidStudentsLink: page.locator('a:has(span:text("Unpaid Students"))'),
  newStudentsLinkPending: page.locator('a[href="/enrolled-students/pending-enrollment"]'),
  newStudentsLinkUnpaid: page.locator('a[href="/enrolled-students/pending-payments"]')
});

/**
 * Search and verify student with pagination handling
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name to search for
 * @returns {Promise<boolean>}
 */
async function searchAndVerifyStudent(page, elements, studentName) {
  console.log(`Searching for student: ${studentName}`);
  const searchInput = page.locator('input[name="EnrolledStudentsSearch[name]"]');
  await searchInput.fill(studentName);
  await page.waitForTimeout(1000);
  await searchInput.press('Enter');
  await page.waitForTimeout(2000);
  
  try {
    while (true) {
      // Check if student exists on current page
      const studentRow = page.locator(`tr:has-text("${studentName}")`);
      if (await studentRow.isVisible()) {
        console.log(`Found student "${studentName}"`);
        return true;
      }
      const nextPage = page.locator('.pagination li a').filter({ hasText: '»' });
      const hasNextPage = await nextPage.isVisible();
      if (!hasNextPage) {
        break;
      }
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

/**
 * Confirm enrollment for a student
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function confirmEnrollment(page, elements, studentName) {
  await searchAndVerifyStudent(page, elements, studentName);
  const studentRow = page.locator(`tr:has-text("${studentName}")`);
  if (await studentRow.isVisible()) {
    await studentRow.locator('.skip-export > a').first().click();
    await page.getByText('Ok', { exact: true }).click();
    console.log('---------Enrollment Confirmed-------');
  }
}

/**
 * Mark student as paid
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @returns {Promise<void>}
 */
async function markAsPaid(page, elements, studentName) {
  await searchAndVerifyStudent(page, elements, studentName);
  const studentRow = page.locator(`tr:has-text("${studentName}")`);
  if (await studentRow.isVisible()) {
    await studentRow.getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'Yes, mark as paid' }).click();
    await page.waitForSelector('.swal2-confirm', { timeout: 5000 });
    await page.locator('.swal2-confirm').click();
    console.log(`Successfully marked "${studentName}" as paid`);
  }
}

/**
 * Verify student in active students list
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} elements - Page elements
 * @param {string} studentName - Student name
 * @param {string} course - Course name
 * @returns {Promise<void>}
 */
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
    await elements.courseCodeOrNameTextbox.fill(course);
    await elements.searchButton.click();
    await page.waitForTimeout(2000);
    const courseLink = page.getByRole('link', { name: course });
    await courseLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
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
    const studentSearchInput = page.locator('input[name="CourseStudentsSearch[student_name]"]');
    await studentSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await studentSearchInput.clear();
    await page.waitForTimeout(500);
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
      await page.waitForSelector('table tbody tr', { timeout: 20000 });
      const studentRow = page.locator('table tbody tr', {
        has: page.locator('td', { hasText: studentName })
      });
      const isVisible = await studentRow.first().isVisible();
      console.log(
        isVisible
          ? `✅ "${studentName}" is found — successfully enrolled and active.`
          : `❌ "${studentName}" not visible but exists in DOM.`
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

module.exports = {
  retry,
  debugInputState,
  verifyInputValue,
  selectors,
  getPageElements,
  searchAndVerifyStudent,
  confirmEnrollment,
  markAsPaid,
  verifyInActiveStudents
};
