/**
 * Extracts values from a specific column in the table
 * @param {Page} page - Playwright page object
 * @param {string} columnType - Type of column to extract ('cat_name' or 'created_at')
 * @returns {Promise<string[]>} Array of column values
 */
async function getColumnValues(page, columnType) {
  if (columnType === 'cat_name') {
    return await page.$$eval('tbody tr td[data-col-seq="1"]', 
      cells => cells.map(cell => cell.textContent.trim()));
  } else if (columnType === 'created_at') {
    return await page.$$eval('tbody tr td[data-col-seq="2"]', 
      cells => cells.map(cell => cell.textContent.trim()));
  }
}

/**
 * Takes screenshot of the current page state
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name for the screenshot file
 */
async function takeScreenshot(page, fileName) {
  await page.screenshot({ path: fileName });
}

/**
 * Gets the current sort status from the sort icon
 * @param {Page} page - Playwright page object
 * @returns {Promise<string>} The class name of the sort icon or status message
 */
async function getSortStatus(page) {
  return await page.evaluate(() => {
    const header = document.querySelector('th[data-col-seq="1"] a.kv-sort-link');
    if (!header) return 'Header not found';
    const sortIcon = header.querySelector('.kv-sort-icon i');
    if (!sortIcon) return 'No sort icon';
    return sortIcon.className;
  });
}

/**
 * Gets the URL of the sort link
 * @param {Page} page - Playwright page object
 * @param {string} selector - Selector for the sort link
 * @returns {Promise<string>} The href of the sort link
 */
async function getSortLinkUrl(page, selector) {
  return await page.evaluate(selector => {
    const link = document.querySelector(selector);
    return link ? link.href : 'No href found';
  }, selector);
}

/**
 * Wait for page update after sorting action
 * @param {Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function waitForSortUpdate(page) {
  try {
    await Promise.race([
      page.waitForNavigation({ timeout: 5000 }).catch(() => console.log('No full navigation occurred')),
      page.waitForResponse(
        response => response.url().includes('course-categories') && response.status() === 200,
        { timeout: 5000 }
      ).catch(() => console.log('No matching response detected'))
    ]);
  } catch (e) {
    console.log('Waiting error:', e.message);
  }
  
  // Add a small wait to ensure UI updates
  await page.waitForTimeout(2000);
}

/**
 * Check if array is sorted alphabetically (A-Z)
 * @param {string[]} arr - Array of strings to check
 * @returns {boolean} True if sorted alphabetically
 */
function verifySorting(arr) {
  console.log('Checking A-Z sorting:', arr);
  
  // Case-insensitive sorting check
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i-1].toLowerCase();
    const curr = arr[i].toLowerCase();
    
    if (prev > curr) {
      console.log(`Sorting issue at index ${i}: "${arr[i-1]}" should come after "${arr[i]}"`);
      return false;
    }
  }
  return true;
}

/**
 * Check if array is sorted in reverse alphabetical order (Z-A)
 * @param {string[]} arr - Array of strings to check
 * @returns {boolean} True if sorted in reverse alphabetical order
 */
function verifyReverseSorting(arr) {
  console.log('Checking Z-A sorting:', arr);
  
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i-1].toLowerCase();
    const curr = arr[i].toLowerCase();
    
    if (prev < curr) {
      console.log(`Reverse sorting issue at index ${i}: "${arr[i-1]}" should come before "${arr[i]}"`);
      return false;
    }
  }
  return true;
}

/**
 * Check if array is sorted according to natural sorting rules
 * @param {string[]} arr - Array of strings to check
 * @returns {boolean} True if naturally sorted
 */
function isNaturallySorted(arr) {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });
  
  for (let i = 1; i < arr.length; i++) {
    if (collator.compare(arr[i-1], arr[i]) > 0) {
      console.log(`Natural sorting issue at index ${i}: "${arr[i-1]}" should come after "${arr[i]}"`);
      return false;
    }
  }
  return true;
}

// Export all functions for use in test file
module.exports = {
  getColumnValues,
  takeScreenshot,
  getSortStatus,
  getSortLinkUrl,
  waitForSortUpdate,
  verifySorting,
  verifyReverseSorting,
  isNaturallySorted
};
