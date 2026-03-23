const { test } = require('@playwright/test');
const { StudentUrlCollector } = require('./pages/StudentUrlCollector');
const { logPage } = require('../utils/reportSteps');

test.describe('Student URL Collector - Manual Navigation', () => {
  
  // Set test timeout to 20 minutes (1200000ms) for manual navigation
  test.setTimeout(20 * 60 * 1000);
  
  test('Login and Collect URLs from Manual Navigation', async ({ page }) => {
    const urlCollector = new StudentUrlCollector(page);
    
    // Step 1: Login as student
    await urlCollector.loginAsStudent();
    await logPage(page, 'Student Login - URL Collection Started');
    
    // Step 2: Start URL collection
    await urlCollector.startUrlCollection();
    
    // Step 3: Wait for user to manually click links (15 minutes timeout)
    // User can click on any links during this time
    await urlCollector.waitForManualNavigation(15);
    
    // Step 4: Stop collection and save URLs
    urlCollector.stopUrlCollection();
    
    // Step 5: Get collected URLs
    const collectedUrls = urlCollector.getCollectedUrls();
    console.log(`\n📊 Collected ${collectedUrls.length} URLs:`);
    collectedUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${url.title} - ${url.url}`);
    });
    
    // Step 6: Save to file
    await urlCollector.saveCollectedUrls();
    
    // Step 7: Get summary
    const summary = urlCollector.getUrlSummary();
    console.log('\n📈 Summary:');
    console.log(`   Total URLs: ${summary.total}`);
    console.log(`   Unique Paths: ${summary.uniquePaths}`);
    
    // Take screenshot
    await page.screenshot({
      path: 'screenshots/URL-Collection-Complete.png',
      fullPage: true
    });
  });

  test('Load and Display Previously Collected URLs', async ({ page }) => {
    const urlCollector = new StudentUrlCollector(page);
    
    // Load previously collected URLs
    const urls = urlCollector.loadCollectedUrls();
    
    if (urls.length > 0) {
      console.log(`\n📂 Found ${urls.length} previously collected URLs:\n`);
      urls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.title || 'No title'}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Path: ${url.pathname}`);
        console.log(`   Time: ${url.timestamp}\n`);
      });
      
      // Get summary
      const summary = urlCollector.getUrlSummary();
      console.log('📈 Summary:');
      console.log(`   Total URLs: ${summary.total}`);
      console.log(`   Unique Paths: ${summary.uniquePaths}`);
    } else {
      console.log('⚠️ No previously collected URLs found.');
      console.log('   Run the "Login and Collect URLs" test first to collect URLs.');
    }
  });
});
