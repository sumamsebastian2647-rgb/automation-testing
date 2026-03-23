const config = require('../../config');
const { LoginPage } = require('./LoginPage');
const DashboardPage = require('./DashboardPage');
const fs = require('fs');
const path = require('path');

class StudentUrlCollector {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.collectedUrls = [];
    this.urlDataFile = path.join(__dirname, '../../data/collected-urls.json');
  }

  /**
   * Login as student using credentials from config
   */
  async loginAsStudent() {
    await this.loginPage.goto();
    await this.loginPage.login(
      config.credentials.username,
      config.credentials.password
    );
    
    // Wait for dashboard to load
    await this.page.waitForLoadState('networkidle');
    
    // Close any modals that might appear
    await this.dashboardPage.closeDashboardModalIfVisible();
    
    console.log('✅ Successfully logged in as student');
    console.log('👆 You can now manually click on links. URLs will be captured automatically.');
  }

  /**
   * Start listening to navigation events and collect URLs
   */
  async startUrlCollection() {
    // Clear previous collection
    this.collectedUrls = [];

    // Listen to all navigation events
    this.page.on('framenavigated', async (frame) => {
      if (frame === this.page.mainFrame()) {
        const url = frame.url();
        const timestamp = new Date().toISOString();
        const title = await this.page.title().catch(() => 'Unknown');
        
        // Get page content info
        const parsedUrl = new URL(url);

        let pageInfo = {
          // Store relative URL (no domain) so it works across environments
          url: `${parsedUrl.pathname}${parsedUrl.search}`,
          title: title,
          timestamp: timestamp,
          pathname: parsedUrl.pathname,
          search: parsedUrl.search
        };

        // Check if URL already collected
        const existingUrl = this.collectedUrls.find(u => u.url === url);
        if (!existingUrl) {
          this.collectedUrls.push(pageInfo);
          console.log(`📌 Captured URL #${this.collectedUrls.length}: ${url}`);
          console.log(`   Title: ${title}`);
        }
      }
    });

    // Also listen to requests to catch AJAX navigation
    this.page.on('request', async (request) => {
      const url = request.url();
      const method = request.method();
      
      // Only capture GET requests that look like page navigations
      if (method === 'GET' && (url.includes('/student/') || url.includes('/site/'))) {
        const existingUrl = this.collectedUrls.find(u => u.url === url);
        if (!existingUrl && !url.includes('.css') && !url.includes('.js') && !url.includes('.png') && !url.includes('.jpg')) {
          try {
            const parsedUrl = new URL(url);
            const timestamp = new Date().toISOString();
            this.collectedUrls.push({
              // Store relative URL (no domain) so it works across environments
              url: `${parsedUrl.pathname}${parsedUrl.search}`,
              title: 'AJAX Navigation',
              timestamp: timestamp,
              pathname: parsedUrl.pathname,
              search: parsedUrl.search,
              type: 'ajax'
            });
            console.log(`📌 Captured AJAX URL: ${url}`);
          } catch (e) {
            // Skip invalid URLs
          }
        }
      }
    });

    console.log('🎯 URL collection started. Click on any links manually.');
  }

  /**
   * Stop URL collection
   */
  stopUrlCollection() {
    console.log(`\n✅ URL collection stopped. Total URLs collected: ${this.collectedUrls.length}`);
  }

  /**
   * Get all collected URLs
   */
  getCollectedUrls() {
    return this.collectedUrls;
  }

  /**
   * Save collected URLs to JSON file
   */
  async saveCollectedUrls() {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(this.urlDataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing URLs if file exists
    let existingUrls = [];
    if (fs.existsSync(this.urlDataFile)) {
      try {
        const fileContent = fs.readFileSync(this.urlDataFile, 'utf8');
        existingUrls = JSON.parse(fileContent);
      } catch (e) {
        console.log('⚠️ Could not read existing URLs file, starting fresh');
      }
    }

    // Merge with existing URLs (avoid duplicates)
    const allUrls = [...existingUrls];
    for (const url of this.collectedUrls) {
      const exists = allUrls.find(u => u.url === url.url);
      if (!exists) {
        allUrls.push(url);
      }
    }

    // Save to file
    fs.writeFileSync(this.urlDataFile, JSON.stringify(allUrls, null, 2));
    console.log(`💾 Saved ${allUrls.length} URLs to ${this.urlDataFile}`);
    
    return allUrls;
  }

  /**
   * Load previously collected URLs
   */
  loadCollectedUrls() {
    if (fs.existsSync(this.urlDataFile)) {
      try {
        const fileContent = fs.readFileSync(this.urlDataFile, 'utf8');
        this.collectedUrls = JSON.parse(fileContent);
        console.log(`📂 Loaded ${this.collectedUrls.length} URLs from file`);
        return this.collectedUrls;
      } catch (e) {
        console.log('⚠️ Could not load URLs from file');
        return [];
      }
    }
    return [];
  }

  /**
   * Get summary of collected URLs
   */
  getUrlSummary() {
    const summary = {
      total: this.collectedUrls.length,
      uniquePaths: [...new Set(this.collectedUrls.map(u => u.pathname))].length,
      urls: this.collectedUrls.map(u => ({
        url: u.url,
        title: u.title,
        pathname: u.pathname
      }))
    };
    return summary;
  }

  /**
   * Wait for user to finish manual clicking (with timeout)
   * Uses smaller chunks to avoid test timeout issues
   */
  async waitForManualNavigation(timeoutMinutes = 15) {
    console.log(`⏳ Waiting for ${timeoutMinutes} minutes for manual navigation...`);
    console.log('   Click on any links you want to capture.');
    console.log('   The browser will stay open. Close it manually when done, or wait for timeout.\n');

    const totalWaitTime = timeoutMinutes * 60 * 1000; // Convert to milliseconds
    const chunkSize = 60000; // Wait in 1-minute chunks
    const chunks = Math.ceil(totalWaitTime / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
      try {
        // Check if page is still open
        if (this.page.isClosed()) {
          console.log('\n🔒 Browser closed by user. Stopping collection.');
          this.stopUrlCollection();
          return;
        }
        
        // Wait in 1-minute chunks
        await this.page.waitForTimeout(chunkSize);
        
        const remainingMinutes = Math.ceil((totalWaitTime - (i + 1) * chunkSize) / 60000);
        if (remainingMinutes > 0) {
          console.log(`⏳ Still collecting... ${remainingMinutes} minutes remaining. URLs collected so far: ${this.collectedUrls.length}`);
        }
      } catch (error) {
        // Page might be closed or navigation happened
        if (error.message.includes('closed') || error.message.includes('Target closed')) {
          console.log('\n🔒 Browser closed. Stopping collection.');
          this.stopUrlCollection();
          return;
        }
        // Continue waiting if it's just a timeout or other error
      }
    }
    
    console.log('\n⏰ Timeout reached. Stopping collection.');
    this.stopUrlCollection();
  }
}

module.exports = { StudentUrlCollector };
