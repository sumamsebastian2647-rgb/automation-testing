/**
 * Utility functions for date sorting validation
 */

/**
 * Checks if dates are sorted in descending order (newest first)
 * @param {string[]} dateArr - Array of date strings in DD-MM-YYYY format
 * @returns {boolean} True if dates are sorted newest to oldest
 */
async function isDateSortedDescending(dateArr) {
  console.log('Checking if dates are sorted newest first...');
  // Convert DD-MM-YYYY to Date objects
  const dates = dateArr.map(dateStr => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] > dates[i-1]) {
      console.log(`❌ Date sorting error at index ${i}: ${dateArr[i]} (newer) should come before ${dateArr[i-1]} (older)`);
      return false;
    }
  }
  return true;
}

/**
 * Checks if dates are sorted in ascending order (oldest first)
 * @param {string[]} dateArr - Array of date strings in DD-MM-YYYY format
 * @returns {boolean} True if dates are sorted oldest to newest
 */
async function isDateSortedAscending(dateArr) {
  console.log('Checking if dates are sorted oldest first...');
  // Convert DD-MM-YYYY to Date objects
  const dates = dateArr.map(dateStr => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] < dates[i-1]) {
      console.log(`❌ Date sorting error at index ${i}: ${dateArr[i]} (older) should come after ${dateArr[i-1]} (newer)`);
      return false;
    }
  }
  return true;
}

/**
 * Gets all date values from the Created column
 * @param {Page} page - Playwright page object
 * @returns {Promise<string[]>} Array of date strings
 */
async function getDateValues(page) {
  return await page.$$eval('tbody tr td[data-col-seq="2"]', 
    cells => cells.map(cell => cell.textContent.trim()));
}

/**
 * Takes a screenshot with error handling
 * @param {Page} page - Playwright page object 
 * @param {string} fileName - Name of the screenshot file
 * @returns {Promise<boolean>} Success status
 */
async function takeScreenshot1(page, fileName) {
  try {
    // Create screenshots directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    
    const dir = './screenshots';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save screenshot with full path
    await page.screenshot({ path: path.join(dir, fileName) });
    console.log(`✅ Screenshot saved: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error taking screenshot ${fileName}:`, error.message);
    // Continue test even if screenshot fails
    return false;
  }
}

/**
 * Waits for the page to update after a sort operation
 * @param {Page} page - Playwright page object
 */
async function waitForSortUpdate1(page) {
  try {
    await Promise.race([
      page.waitForNavigation({ timeout: 5000 }).catch(() => {}),
      page.waitForResponse(
        response => response.url().includes('course-categories') && response.status() === 200,
        { timeout: 5000 }
      ).catch(() => {})
    ]);
  } catch (e) {
    console.log('Wait error:', e);
  }
  
  // Add a small buffer to ensure UI updates
  await page.waitForTimeout(1000);
}

/**
 * Gets the URL or class of a sort link
 * @param {Page} page - Playwright page object
 * @param {string} selector - Selector for the sort link
 * @param {string} attribute - Attribute to retrieve ('href' or 'className')
 * @returns {Promise<string>} The requested attribute value
 */
async function getSortLinkAttribute(page, selector, attribute) {
  // Fixed: Pass arguments as a single object to page.evaluate()
  return await page.evaluate(({ selector, attribute }) => {
    const link = document.querySelector(selector);
    return link ? link[attribute] : null;
  }, { selector, attribute }); // Pass as a single object with named properties
}

// Export all functions WITH THE CORRECT NAMES
module.exports = {
  isDateSortedDescending,
  isDateSortedAscending,
  getDateValues,
  takeScreenshot1,
  waitForSortUpdate1,
  getSortLinkAttribute,
  // Add aliases for compatibility with code that uses names without suffix
  takeScreenshot: takeScreenshot1,
  waitForSortUpdate: waitForSortUpdate1
};
