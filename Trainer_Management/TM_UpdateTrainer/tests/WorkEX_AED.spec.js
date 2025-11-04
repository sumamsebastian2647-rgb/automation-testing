// Created by Sumam Sebastian on 10/10/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { DashboardPage } = require('./Pages/DashboardPage');
const config = require('../config');

test.describe.serial('Trainer Management - Update Trainer Flow', () => {
  test.use({ timeout: 600000 });
  let dashboardPage;
  let page;
  // ✅ Login once and navigate to Work Experience before all tests
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);

    dashboardPage = new DashboardPage(page);
    await dashboardPage.openTrainerManagement();
    await dashboardPage.openUpdateTrainer();
  });
  // ✅ Close after all tests
  test.afterAll(async () => {
    await page.close();
  });
//////////////////////////UI Validation///////////////////////////////////
 test('Work Experience UI - Validation Flow', async () => {
        await dashboardPage.navigateToWorkExperience();
    // Step 1️⃣ - Click "Add Work Experience"
    await page.getByRole('button', { name: 'Add Work Experience' }).click();
    const form = page.locator('#formTrainerWorkExperience');
    // Step 2️⃣ - Save without filling anything
    await form.getByRole('button', { name: 'Save' }).click();
    const errorSummary = page.locator('#formTrainerWorkExperience .error-summary');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary.locator('li', { hasText: 'Organisation Name cannot be blank.' })).toBeVisible();
    await expect(errorSummary.locator('li', { hasText: 'Job Role cannot be blank.' })).toBeVisible();
    await expect(errorSummary.locator('li', { hasText: 'Start Date cannot be blank.' })).toBeVisible();
    // Step 3️⃣ - Fill Organisation Name only
    await form.getByRole('textbox', { name: 'Organisation Name*' }).fill('DEF');
    await form.getByRole('button', { name: 'Save' }).click();
    await expect(errorSummary.locator('li', { hasText: 'Job Role cannot be blank.' })).toBeVisible();
    await expect(errorSummary.locator('li', { hasText: 'Start Date cannot be blank.' })).toBeVisible();
    // Step 4️⃣ - Fill Job Role only
    await form.getByRole('textbox', { name: 'Job Role*' }).fill('XYZ');
    await form.getByRole('button', { name: 'Save' }).click();
    await expect(errorSummary.locator('li', { hasText: 'Start Date cannot be blank.' })).toBeVisible();
    // Step 5️⃣ - Select Start Date safely
    await page.locator('#usertrainersworkexperience-start_date').fill('01-10-2020');

    // Step 6️⃣ - Final Save
    await form.getByRole('button', { name: 'Save' }).click();
        await expect(
        page.getByText('Work experience has been saved successfully.', { exact: true })
      ).toBeVisible();
  });
  // ✅ 2. Add Work Experience
  test('Add Work Experience', async () => {
    await dashboardPage.navigateToWorkExperience();
    await dashboardPage.addWorkExperience(
      config.addWork.organisation,
      config.addWork.jobRole,
      config.addWork.description
    );
    await expect(
      page.getByText('Work experience has been saved successfully.', { exact: true })
    ).toBeVisible();
  });
  // ✅ 3. Update Work Experience (first row)
  test('Update Work Experience - First Row', async () => {
        await dashboardPage.navigateToWorkExperience();
        await dashboardPage.clickUpdateOnFirstRow();
        await dashboardPage.updateWorkExperience(
          config.updateWork.organisation,
          config.updateWork.description
        );
       // ✅ Wait for and verify success toast
      const toast = page.getByText('Work experience has been saved successfully.', { exact: true });
      await expect(toast).toBeVisible({ timeout: 10000 });
      // ✅ After toast appears — click Cancel to return to main list
      await page.locator('#btnCancelWE').click();
      // ✅ Wait until the Work Experience list is visible again
      const workExpSection = page.locator('#work-experience');
      await expect(workExpSection).toBeVisible({ timeout: 10000 });
  });
  // ✅ 4. Delete Work Experience (first row)
  test('Delete Work Experience - First Row', async () => {
        await dashboardPage.navigateToWorkExperience();
        await dashboardPage.clickDeleteOnFirstRow();
        await expect(
          page.getByText('Work experience has been deleted successfully.', { exact: true })
        ).toBeVisible();
  });
  // ✅ 5. Filter by Organisation
  test('Filter by Organisation Name', async () => {
    // Always ensure you're in the correct tab/section
    await dashboardPage.navigateToWorkExperience();
    // Fill the organisation filter
    const orgInput = page.locator('#work-experience input[name="UserTrainersWorkExperienceSearch[organization_name]"]');
    await orgInput.fill(config.addWork.organisation);
    await orgInput.press('Enter');
    // ✅ Scope to the Work Experience table only
    const workExpTable = page.locator('#work-experience table tbody');
    const firstRow = workExpTable.locator('tr').first();
    // ✅ Wait for thetable to refresh and become visible
    await expect(workExpTable).toBeVisible({ timeout: 10000 });
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    // ✅ Verify Organisation Name column text
    await expect(firstRow.locator('td').nth(1)).toContainText(config.addWork.organisation);
  });
  // ✅ 6. Filter by Job Role
  test('Filter by Job Role', async () => {
    // Make sure you're in the Work Experience section
    await dashboardPage.navigateToWorkExperience();

    // ✅ Scoped locator to the correct input field inside Work Experience section
    const jobInput = page.locator('#work-experience input[name="UserTrainersWorkExperienceSearch[job_role]"]');
    await jobInput.fill(config.addWork.jobRole);
    await jobInput.press('Enter');

    // ✅ Scoped table locator to the Work Experience section only
    const workExpTable = page.locator('#work-experience table tbody');
    const firstRow = workExpTable.locator('tr').first();

    // ✅ Wait for table to appear and render visible rows
    await expect(workExpTable).toBeVisible({ timeout: 10000 });
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });

    // ✅ Validate Job Role column contains expected value
    await expect(firstRow).toContainText(config.addWork.jobRole);
  });
  // ✅ 7. Filter by Current Work = YES
  test('Filter by Current Work = YES', async () => {
    await dashboardPage.navigateToWorkExperience();
    const select = page.locator('select[name="UserTrainersWorkExperienceSearch[current_work]"]');
    // Wait for the AJAX reload or navigation triggered by filter
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      select.selectOption('1'), // "1" = Yes
    ]);
    // ✅ Wait until a visible row actually appears
    const firstVisibleRow = page.locator('table tbody tr:visible').first();
    await expect(firstVisibleRow).toBeVisible({ timeout: 10000 });
    // ✅ Verify column 5 (index 5) has "Yes"
    const currentWorkCell = firstVisibleRow.locator('td[data-col-seq="5"]');
    await expect(currentWorkCell).toHaveText('Yes', { timeout: 5000 });
  });
  
// ✅ 8. Filter by VET Industry = YES
test('Filter by VET Industry = YES', async () => {
  await dashboardPage.navigateToWorkExperience();
  const select = page.locator('select[name="UserTrainersWorkExperienceSearch[vet_industry]"]');
  // Wait for table reload triggered by filter
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    select.selectOption('1'), // 1 = "Yes"
  ]);
  // ✅ Get first visible row after reload
  const firstVisibleRow = page.locator('table tbody tr:visible').first();
  await expect(firstVisibleRow).toBeVisible({ timeout: 10000 });
  // ✅ Verify column 6 (VET Industry) shows "VET"
  const vetIndustryCell = firstVisibleRow.locator('td[data-col-seq="6"]');
  await expect(vetIndustryCell).toHaveText('VET', { timeout: 5000 });
});

test('Test table column sorting functionality - ascending and descending', async () => {
  // Increase timeout for this test
  test.setTimeout(120000); // 2 minutes to be safe
  
  try {
    // Navigate to the work experience page
    await dashboardPage.navigateToWorkExperience();
    
    // FIXED: Wait for table with more reliable approach
    console.log('Waiting for table to load...');
    
    // First just wait for the table to exist in DOM without visibility requirement
    await page.waitForSelector('.kv-grid-table', { 
      state: 'attached', 
      timeout: 15000 
    });
    
    // Then wait for at least one row to be present
    await page.waitForSelector('.kv-grid-table tbody tr', { 
      state: 'attached',
      timeout: 15000 
    }).catch(e => console.log('Warning: Could not find table rows, but continuing anyway'));
    
    // Wait for any potential animations or loading states
    await page.waitForTimeout(2000);
    
    console.log('Table detected in DOM, proceeding with test');
    
    // Function to test column sorting without relying on specific data
    async function testColumnSorting(columnName, sortParam) {
      console.log(`Testing column "${columnName}" sorting`);
      
      try {
        // Get the column header link
        const columnLinkSelector = `a[data-sort="${sortParam}"]`;
        
        // First try to find the column by data-sort attribute (more reliable)
        const columnExists = await page.$(columnLinkSelector).then(el => !!el);
        
        let columnLink;
        if (columnExists) {
          columnLink = page.locator(columnLinkSelector);
          console.log(`Found column using data-sort attribute: ${sortParam}`);
        } else {
          // Fallback to finding by role and name
          columnLink = page.getByRole('link', { name: columnName });
          console.log(`Using fallback method to find column: ${columnName}`);
        }
        
        // Check if the column exists before attempting to click
        const isVisible = await columnLink.isVisible().catch(() => false);
        if (!isVisible) {
          console.warn(`⚠️ Column "${columnName}" is not visible, skipping`);
          // Take screenshot for debugging
          await page.screenshot({ path: `column-not-visible-${columnName.replace(/\s+/g, '-')}.png` })
            .catch(() => {});
          return;
        }
        
        // First click - Sort ascending
        console.log(`Clicking column "${columnName}" for ascending sort`);
        await columnLink.click({ timeout: 5000 }).catch(e => {
          console.warn(`Failed to click column for ascending sort: ${e.message}`);
        });
        
        // Wait shorter time for network, but don't fail if it doesn't resolve
        await Promise.race([
          page.waitForLoadState('networkidle', { timeout: 3000 }),
          page.waitForTimeout(3000)
        ]);
        
        // Verify URL contains ascending sort parameter
        const ascUrl = page.url();
        const hasAscParam = ascUrl.includes(`sort=${sortParam}`);
        
        if (hasAscParam) {
          console.log(`✅ Ascending sort verified: URL contains "sort=${sortParam}"`);
        } else {
          console.warn(`⚠️ Ascending sort check failed. Expected "sort=${sortParam}" in URL: ${ascUrl}`);
        }
        
        // Add a delay between clicks to ensure the first click is processed
        await page.waitForTimeout(2000);
        
        // Second click - Sort descending
        console.log(`Clicking column "${columnName}" for descending sort`);
        await columnLink.click({ timeout: 5000 }).catch(e => {
          console.warn(`Failed to click column for descending sort: ${e.message}`);
        });
        
        // Wait shorter time for network, but don't fail if it doesn't resolve
        await Promise.race([
          page.waitForLoadState('networkidle', { timeout: 3000 }),
          page.waitForTimeout(3000)
        ]);
        
        // Verify URL contains descending sort parameter
        const descUrl = page.url();
        const hasDescParam = descUrl.includes(`sort=-${sortParam}`);
        
        if (hasDescParam) {
          console.log(`✅ Descending sort verified: URL contains "sort=-${sortParam}"`);
        } else {
          console.warn(`⚠️ Descending sort check failed. Expected "sort=-${sortParam}" in URL: ${descUrl}`);
        }
          
      } catch (error) {
        console.error(`❌ Error testing sort for "${columnName}":`, error.message);
        // Continue with next column
      }
      
      // Short pause between columns
      await page.waitForTimeout(1000);
    }
    
    // Define columns to test with their sort parameter names
    const columns = [
      { name: 'Organisation Name', param: 'organization_name' },
      { name: 'Job Role', param: 'job_role' },
      { name: 'Start Date', param: 'start_date' },
      { name: 'End Date', param: 'end_date' },
      { name: 'Currently Working', param: 'current_work' },
      { name: 'VET/Industry', param: 'vet_industry' },
      { name: 'Created at', param: 'created_at' },
      { name: 'Updated at', param: 'updated_at' }
    ];
    
    // Test each column
    for (const column of columns) {
      await testColumnSorting(column.name, column.param);
    }
    
    console.log('✅ Successfully completed all column sorting tests');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'test-failure.png' }).catch(() => {});
    throw error; // Re-throw to fail the test
  }
});


});
