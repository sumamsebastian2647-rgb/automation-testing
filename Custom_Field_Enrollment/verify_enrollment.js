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
  studentManagementLink: page.locator('li#student_management:has(a span:text("Student Management"))'),
  enrolledStudentsSearchInput: page.locator('input[name="EnrolledStudentsSearch[name]"]'),
  activeStudentsLink: page.locator('a[href="/enrolled-students/index"]'),
  courseCodeOrNameTextbox: page.locator('#coursesearch-c_name'),
  searchButton: page.getByRole('button', { name: 'Search' }),
  enrolledStudentsSearchNameInput: page.locator('input[name="CourseStudentsSearch[student_name]"]'),
  pendingEnrolmentLink: page.getByRole('link', { name: selectors.pendingEnrolment }),
  newStudentsLink: page.getByRole('link', { name: selectors.newStudents }),
  unpaidStudentsLink: page.locator('a:has(span:text("Unpaid Students"))'),
  //unpaidStudentsLink: page.getByRole('link', { name: selectors.unpaidStudents }),
  newStudentsLinkPending: page.locator('a[href="/enrolled-students/pending-enrollment"]'),
  newStudentsLinkUnpaid: page.locator('a[href="/enrolled-students/pending-payments"]'),
  unpaidStudentsLink: page.getByRole('link', { name: selectors.unpaidStudents }),
  globalSearchTrigger: page.locator('#globalSearchTrigger'),
  globalSearchModal: page.locator('.modal-dialog'), // Assuming search opens in a modal
  globalSearchInput: page.locator('.modal input[type="text"]'), // Actual search input in modal
  searchResults: page.locator('.search-results, .dropdown-menu, .list-group, .globalsearch-result-container'), // Common search result containers
  globalSearchResultContainer: page.locator('.globalsearch-result-container'),
  resultTitle: page.locator('.result-title')
});

// Global search function
async function performGlobalSearch(page, studentName) {
  console.log(`Performing global search for: ${studentName}`);
  const elements = getPageElements(page);
  
  try {
    // Click on the global search trigger
    await elements.globalSearchTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await elements.globalSearchTrigger.click();
    
    // Wait for search modal or dropdown to appear
    await page.waitForTimeout(1000);
    
    // Try different possible search input selectors
    let searchInput = null;
    const possibleSelectors = [
      '.modal input[type="text"]',
      '.modal input[type="search"]', 
      '.dropdown-menu input',
      'input[placeholder*="Search"]',
      '.search-input',
      '#globalSearch',
      '.global-search-input'
    ];
    
    for (const selector of possibleSelectors) {
      try {
        const input = page.locator(selector);
        if (await input.isVisible({ timeout: 2000 })) {
          searchInput = input;
          console.log(`Found search input with selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (!searchInput) {
      throw new Error('Could not find the search input field');
    }
    
    // Clear and fill the search input
    await searchInput.clear();
    await searchInput.fill(studentName);
    await page.waitForTimeout(1000);
    
    // Press Enter or look for search button
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);
    
    // Wait for search results to appear with the specific structure
    await page.waitForSelector('.globalsearch-result-container', { timeout: 10000 });
    
    // Look for the student name in the specific result structure
    const studentResult = page.locator('.globalsearch-result-container').filter({
      has: page.locator(`.result-title:has-text("${studentName}")`)
    }).first();
    
    // Alternative selectors for the student result
    const alternativeSelectors = [
      `.globalsearch-result-container:has(.result-title:text-is("${studentName}"))`,
      `.globalsearch-result-container:has(.result-title:text("${studentName}"))`,
      `.result-title:has-text("${studentName}")`,
      `.globalsearch-result-container:has-text("${studentName}")`
    ];
    
    let clickableElement = null;
    
    // Try the main selector first
    if (await studentResult.isVisible({ timeout: 3000 })) {
      clickableElement = studentResult;
      console.log(`Found student "${studentName}" in search results using main selector`);
    } else {
      // Try alternative selectors
      for (const selector of alternativeSelectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            clickableElement = element;
            console.log(`Found student "${studentName}" using selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
    }
    
    if (clickableElement) {
      await clickableElement.click();
      await page.waitForLoadState('networkidle');
      console.log(`Successfully clicked on student: ${studentName}`);
      
      // Close the search modal after successful click
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (escapeError) {
        // Ignore escape errors
      }
      
      return true;
    } else {
      console.log(`Student "${studentName}" not found in search results`);
      
      // Close the search modal even if student not found
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (escapeError) {
        // Ignore escape errors
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('Error in global search:', error);
    await page.screenshot({ path: `global-search-error-${Date.now()}.png` });
    
    // Try to close any open modals
    try {
      await page.keyboard.press('Escape');
    } catch (escapeError) {
      // Ignore escape errors
    }
    
    throw error;
  }
}

// Function to close global search modal
async function closeGlobalSearchModal(page) {
  console.log('Attempting to close global search modal...');
  
  try {
    const globalSearchModal = page.locator('#globalSearchModal');
    
    if (await globalSearchModal.isVisible({ timeout: 3000 })) {
      console.log('Global search modal is visible, closing it...');
      
      // Method 1: Press Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      
      // Check if modal is still visible
      if (await globalSearchModal.isVisible({ timeout: 2000 })) {
        console.log('Modal still visible, trying close button...');
        
        // Method 2: Click close button
        const closeSelectors = [
          '#globalSearchModal .close',
          '#globalSearchModal .btn-close', 
          '#globalSearchModal [data-dismiss="modal"]',
          '#globalSearchModal .modal-header button',
          '.modal-backdrop'
        ];
        
        for (const selector of closeSelectors) {
          try {
            const closeButton = page.locator(selector);
            if (await closeButton.isVisible({ timeout: 1000 })) {
              await closeButton.click();
              await page.waitForTimeout(500);
              break;
            }
          } catch (error) {
            // Continue to next selector
          }
        }
      }
      
      // Method 3: JavaScript force close
      if (await globalSearchModal.isVisible({ timeout: 1000 })) {
        console.log('Force closing modal with JavaScript...');
        await page.evaluate(() => {
          const modal = document.querySelector('#globalSearchModal');
          if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('in', 'show');
          }
          
          // Remove backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          
          // Remove modal-open class from body
          document.body.classList.remove('modal-open');
        });
      }
      
      await page.waitForTimeout(1000);
      console.log('Global search modal closed successfully');
      
    } else {
      console.log('Global search modal is not visible');
    }
    
  } catch (error) {
    console.error('Error closing global search modal:', error.message);
  }
}
async function verifyCustomFieldData(page, expectedData = null) {
  console.log('Verifying custom field data on student page...');
  
  try {
    // Wait for the student page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Use expected data from config if not provided
    const { customFieldConfig } = require('./createform_config');
    const dataToVerify = expectedData || customFieldConfig;
    
    console.log('Expected custom field data:', dataToVerify);
    
    // Try to find and click on different tabs that might contain custom fields
    const possibleTabs = [
      'a[href*="student-details"]',
      '.nav-link:has-text("Student Details")',
      '.tab:has-text("Student Details")',
      'a:has-text("Personal Details")',
      'a:has-text("Additional Information")',
      'a:has-text("Custom Fields")',
      '.nav-tabs a',
      '.tab-pane'
    ];
    
    for (const tabSelector of possibleTabs) {
      try {
        const tab = page.locator(tabSelector);
        if (await tab.isVisible({ timeout: 3000 })) {
          console.log(`Found and clicking tab: ${tabSelector}`);
          await tab.first().click();
          await page.waitForTimeout(1000);
          break;
        }
      } catch (error) {
        // Continue to next tab
      }
    }
    
    // Scroll down to make sure all content is loaded
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    // Scroll back up to see all content
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    
    // Look for custom fields sections with more comprehensive search
    const customFieldsSections = [
      'h3:has-text("Custom Fields")',
      'h4:has-text("Custom Fields")', 
      '.section-title:has-text("Custom Fields")',
      '*:has-text("Custom Fields - Residential Information")',
      '*:has-text("Additional Information")',
      'table:has(th:has-text("Custom"))',
      '.custom-fields',
      '.additional-fields'
    ];
    
    for (const sectionSelector of customFieldsSections) {
      try {
        const section = page.locator(sectionSelector);
        if (await section.isVisible({ timeout: 3000 })) {
          console.log(`Found custom fields section: ${sectionSelector}`);
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          break;
        }
      } catch (error) {
        // Continue to next section
      }
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: `custom-fields-verification-${Date.now()}.png` });
    
    const fieldsToCheck = [
      { type: 'text', value: dataToVerify.text },
      { type: 'email', value: dataToVerify.email },
      { type: 'number', value: dataToVerify.number },
      { type: 'textarea', value: dataToVerify.textarea },
      { type: 'date', value: dataToVerify.date },
      { type: 'file', value: dataToVerify.file }
    ];
    
    // Enhanced JavaScript verification with more thorough searching
    const jsVerificationResults = await page.evaluate((fieldsToCheck) => {
      const results = [];
      
      // First, let's get some debugging info about the page
      const debugInfo = {
        pageTitle: document.title,
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 500), // First 500 chars
        tableCount: document.querySelectorAll('table').length,
        inputCount: document.querySelectorAll('input').length,
        hasCustomFieldsText: document.body.innerText.toLowerCase().includes('custom'),
        hasResidentialText: document.body.innerText.toLowerCase().includes('residential')
      };
      
      console.log('Page Debug Info:', debugInfo);
      
      fieldsToCheck.forEach(field => {
        let found = false;
        let foundMethod = '';
        let foundLocation = '';
        
        // Method 1: Check if text exists anywhere in the page (case insensitive)
        const pageText = document.body.innerText.toLowerCase();
        const searchValue = field.value.toLowerCase();
        if (pageText.includes(searchValue)) {
          found = true;
          foundMethod = 'page text content (case insensitive)';
        }
        
        // Method 2: Look for table cells containing the value
        const tableCells = document.querySelectorAll('td, th');
        for (const cell of tableCells) {
          if (cell.textContent) {
            const cellText = cell.textContent.trim();
            if (cellText === field.value) {
              found = true;
              foundMethod = 'table cell exact match';
              foundLocation = cell.closest('table') ? 'in table' : 'in cell';
              break;
            }
            if (cellText.toLowerCase().includes(searchValue)) {
              found = true;
              foundMethod = 'table cell contains (case insensitive)';
              foundLocation = cell.closest('table') ? 'in table' : 'in cell';
              break;
            }
          }
        }
        
        // Method 3: Look for input fields with the value
        const inputs = document.querySelectorAll('input, textarea, select');
        for (const input of inputs) {
          if (input.value === field.value) {
            found = true;
            foundMethod = 'input field value';
            foundLocation = input.name || input.id || 'unnamed input';
            break;
          }
          if (input.value.toLowerCase().includes(searchValue)) {
            found = true;
            foundMethod = 'input field contains (case insensitive)';
            foundLocation = input.name || input.id || 'unnamed input';
            break;
          }
        }
        
        // Method 4: Look for any element containing the text (more thorough)
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
          if (element.textContent && element.children.length === 0) { // Only leaf elements
            const elementText = element.textContent.trim();
            if (elementText === field.value) {
              found = true;
              foundMethod = 'element exact text match';
              foundLocation = element.tagName.toLowerCase() + (element.className ? '.' + element.className : '');
              break;
            }
            if (elementText.toLowerCase().includes(searchValue)) {
              found = true;
              foundMethod = 'element contains (case insensitive)';
              foundLocation = element.tagName.toLowerCase() + (element.className ? '.' + element.className : '');
              break;
            }
          }
        }
        
        // Method 5: Look for data attributes or hidden fields
        const dataElements = document.querySelectorAll('[data-*]');
        for (const element of dataElements) {
          const dataAttrs = element.dataset;
          for (const key in dataAttrs) {
            if (dataAttrs[key] === field.value) {
              found = true;
              foundMethod = 'data attribute';
              foundLocation = `data-${key}`;
              break;
            }
          }
          if (found) break;
        }
        
        results.push({
          fieldType: field.type,
          expectedValue: field.value,
          found: found,
          method: foundMethod,
          location: foundLocation
        });
      });
      
      return { results, debugInfo };
    }, fieldsToCheck);
    
    // Log debug information
    console.log('\n=== Page Debug Information ===');
    console.log('Page Title:', jsVerificationResults.debugInfo.pageTitle);
    console.log('URL:', jsVerificationResults.debugInfo.url);
    console.log('Tables found:', jsVerificationResults.debugInfo.tableCount);
    console.log('Inputs found:', jsVerificationResults.debugInfo.inputCount);
    console.log('Has "custom" text:', jsVerificationResults.debugInfo.hasCustomFieldsText);
    console.log('Has "residential" text:', jsVerificationResults.debugInfo.hasResidentialText);
    console.log('Page text preview:', jsVerificationResults.debugInfo.bodyText);
    
    // Generate detailed report
    console.log('\n=== Enhanced Custom Field Verification Report ===');
    let allFieldsFound = true;
    
    jsVerificationResults.results.forEach((result) => {
      const status = result.found ? '✅ FOUND' : '❌ NOT FOUND';
      
      console.log(`${result.fieldType.toUpperCase()} (${result.expectedValue}): ${status}`);
      
      if (result.found) {
        console.log(`  ✅ Found using: ${result.method}`);
        if (result.location) {
          console.log(`  📍 Location: ${result.location}`);
        }
      } else {
        console.log(`  ❌ Value "${result.expectedValue}" not found anywhere on the page`);
        allFieldsFound = false;
      }
      console.log('');
    });
    
    if (allFieldsFound) {
      console.log('🎉 SUCCESS: All hardcoded configuration values found in student details!');
      console.log('✅ Custom field data from createform_config.js is correctly displayed');
    } else {
      console.log('⚠️  WARNING: Some hardcoded configuration values are missing from student details');
      console.log('❌ This indicates custom field data may not be properly saved during enrollment');
      
      // Additional debugging: show page structure
      const pageStructure = await page.evaluate(() => {
        const structure = [];
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
          const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
          structure.push(`Table ${index + 1}: Headers - ${headers.join(', ')}`);
        });
        
        const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        sections.forEach((section, index) => {
          structure.push(`Section ${index + 1}: ${section.textContent.trim()}`);
        });
        
        return structure;
      });
      
      console.log('📋 Page Structure for Debugging:');
      pageStructure.forEach(item => console.log(`  ${item}`));
    }
    
    return {
      success: allFieldsFound,
      results: jsVerificationResults.results
    };
    
  } catch (error) {
    console.error('Error verifying custom field data:', error);
    await page.screenshot({ path: `custom-field-error-${Date.now()}.png` });
    throw error;
  }
}

// Function to verify custom fields in a specific section
async function verifyCustomFieldsInSection(page, sectionName, expectedData = null) {
  console.log(`Verifying custom fields in section: ${sectionName}`);
  
  try {
    // Use expected data from config if not provided
    const { customFieldConfig } = require('./createform_config');
    const dataToVerify = expectedData || customFieldConfig;
    
    // Scroll down to make sure the section is visible
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    // Look for the section header with more flexible matching
    const possibleSectionSelectors = [
      `h3:has-text("${sectionName}")`,
      `h4:has-text("${sectionName}")`,
      `.section-title:has-text("${sectionName}")`,
      `*:has-text("Custom Fields - ${sectionName}")`,
      `*:has-text("Custom Fields"):has-text("${sectionName}")`,
      `th:has-text("${sectionName}")`,
      `td:has-text("${sectionName}")`
    ];
    
    let sectionFound = false;
    let sectionElement = null;
    
    for (const selector of possibleSectionSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 3000 })) {
          sectionElement = element;
          sectionFound = true;
          console.log(`Found section "${sectionName}" using selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (sectionFound && sectionElement) {
      // Scroll to the section
      await sectionElement.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Use JavaScript to check if the custom field values are present in the section area
      const sectionResults = await page.evaluate((sectionName, dataToVerify) => {
        const results = [];
        const fieldsToCheck = [
          { type: 'text', value: dataToVerify.text },
          { type: 'email', value: dataToVerify.email },
          { type: 'number', value: dataToVerify.number },
          { type: 'textarea', value: dataToVerify.textarea },
          { type: 'date', value: dataToVerify.date }
        ];
        
        // Look for a table or container that might contain the custom fields
        const tables = document.querySelectorAll('table');
        const customFieldsArea = document.querySelector('*[class*="custom"]') || document.body;
        
        fieldsToCheck.forEach(field => {
          let foundInSection = false;
          
          // Check if the value exists in the page content
          if (document.body.innerText.includes(field.value)) {
            foundInSection = true;
          }
          
          results.push({
            fieldType: field.type,
            expectedValue: field.value,
            foundInSection: foundInSection,
            section: sectionName
          });
        });
        
        return results;
      }, sectionName, dataToVerify);
      
      console.log(`Custom field verification results for ${sectionName}:`);
      sectionResults.forEach(result => {
        const status = result.foundInSection ? '✅ Found' : '❌ Not found';
        console.log(`${result.fieldType}: ${status} in ${sectionName}`);
      });
      
      return sectionResults;
      
    } else {
      console.log(`Section "${sectionName}" not found on the page`);
      
      // Try to find custom fields without specific section
      const generalResults = await page.evaluate((dataToVerify) => {
        const results = [];
        const fieldsToCheck = [
          { type: 'text', value: dataToVerify.text },
          { type: 'email', value: dataToVerify.email },
          { type: 'number', value: dataToVerify.number },
          { type: 'textarea', value: dataToVerify.textarea },
          { type: 'date', value: dataToVerify.date }
        ];
        
        fieldsToCheck.forEach(field => {
          const foundAnywhere = document.body.innerText.includes(field.value);
          results.push({
            fieldType: field.type,
            expectedValue: field.value,
            foundInSection: foundAnywhere,
            section: 'General Page Content'
          });
        });
        
        return results;
      }, dataToVerify);
      
      console.log('Checking for custom fields in general page content:');
      generalResults.forEach(result => {
        const status = result.foundInSection ? '✅ Found' : '❌ Not found';
        console.log(`${result.fieldType}: ${status} in page content`);
      });
      
      return generalResults;
    }
    
  } catch (error) {
    console.error(`Error verifying custom fields in section ${sectionName}:`, error);
    throw error;
  }
}
async function performGlobalSearchFlexible(page, studentName) {
  console.log(`Performing flexible global search for: ${studentName}`);
  
  try {
    // Click on the global search trigger
    const searchTrigger = page.locator('#globalSearchTrigger');
    await searchTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await searchTrigger.click();
    
    // Wait for any search interface to appear
    await page.waitForTimeout(1500);
    
    // Use JavaScript to find and interact with search elements
    const searchResult = await page.evaluate((name) => {
      // Try to find any visible input field that might be the search
      const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input[placeholder*="search" i]');
      
      for (const input of inputs) {
        if (input.offsetParent !== null) { // Check if visible
          input.focus();
          input.value = name;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Try pressing Enter
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
          });
          input.dispatchEvent(enterEvent);
          
          return { success: true, inputFound: true };
        }
      }
      
      return { success: false, inputFound: false };
    }, studentName);
    
    if (!searchResult.inputFound) {
      throw new Error('No visible search input found');
    }
    
    // Wait for results and try to click on student name
    await page.waitForTimeout(3000);
    
    // Try to find and click the student result using the specific structure
    const clickResult = await page.evaluate((name) => {
      // First, try to find the specific globalsearch-result-container structure
      const resultContainers = document.querySelectorAll('.globalsearch-result-container');
      
      for (const container of resultContainers) {
        const titleElement = container.querySelector('.result-title');
        if (titleElement && titleElement.textContent.includes(name)) {
          container.click();
          return { success: true, elementFound: true, method: 'globalsearch-result-container' };
        }
      }
      
      // Fallback: try to find result-title directly
      const titleElements = document.querySelectorAll('.result-title');
      for (const titleElement of titleElements) {
        if (titleElement.textContent.includes(name)) {
          titleElement.click();
          return { success: true, elementFound: true, method: 'result-title' };
        }
      }
      
      // Last resort: look for any clickable element containing the student name
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        if (element.textContent && element.textContent.includes(name) && 
            element.offsetParent !== null && 
            (element.tagName === 'A' || element.onclick || element.style.cursor === 'pointer' || 
             element.classList.contains('globalsearch-result-container'))) {
          element.click();
          return { success: true, elementFound: true, method: 'generic-clickable' };
        }
      }
      
      return { success: false, elementFound: false };
    }, studentName);
    
    if (clickResult.elementFound) {
      console.log(`Successfully clicked on student "${studentName}" using method: ${clickResult.method}`);
      await page.waitForLoadState('networkidle');
      
      // Close the search modal after successful click
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (escapeError) {
        // Ignore escape errors
      }
      
      return true;
    } else {
      console.log(`Student "${studentName}" not found in search results`);
      
      // Close the search modal even if student not found
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (escapeError) {
        // Ignore escape errors
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('Error in flexible global search:', error);
    await page.screenshot({ path: `flexible-search-error-${Date.now()}.png` });
    throw error;
  }
}

// Base verification function
async function verifyStudent(page, studentName, course, verificationSteps) {
  console.log(`Verifying student: ${studentName} for course: ${course}`);
  const elements = getPageElements(page);

  try {
    // Close any open modals first (like global search modal)
    try {
      const globalSearchModal = page.locator('#globalSearchModal');
      if (await globalSearchModal.isVisible({ timeout: 2000 })) {
        console.log('Closing global search modal...');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        
        // Alternative: try clicking close button
        const closeButton = page.locator('#globalSearchModal .close, #globalSearchModal .btn-close, #globalSearchModal [data-dismiss="modal"]');
        if (await closeButton.isVisible({ timeout: 2000 })) {
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      }
    } catch (modalError) {
      console.log('No modal to close or error closing modal:', modalError.message);
    }
    
    // Wait for modal to be completely closed
    await page.waitForTimeout(2000);
    
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
  //console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.manualPaid);
}

async function verify_manualunpaidnewstudent(page, course) {
  const personal2 = config.personal2;
  const fullName = `${personal2.firstName} ${personal2.lastName}`.trim();
  console.log('Checking manual unpaid new student');
  //console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.manualUnpaid);
}

async function verify_autopaidnewstudent(page, course) {
  const personal3 = config.personal3;
  const fullName = `${personal3.firstName} ${personal3.lastName}`.trim();
  console.log('Checking auto-paid new student');
  //console.log(`Verifying student: ${fullName}`);
  await verifyStudent(page, fullName, course, verificationSteps.autoPaid);
}

async function verify_autounpaidnewstudent(page, course) {
  const personal4 = config.personal4;
  const fullName = `${personal4.firstName} ${personal4.lastName}`.trim();
  console.log('Checking auto-unpaid new student');
  //console.log(`Verifying student: ${fullName}`);
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
  verify_manualpaidnewstudent_temporary,
  performGlobalSearch,
  performGlobalSearchFlexible,
  verifyCustomFieldData,
  verifyCustomFieldsInSection,
  closeGlobalSearchModal
};
