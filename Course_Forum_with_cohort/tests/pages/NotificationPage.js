const config = require('../../config');
const { expect } = require('@playwright/test');

class NotificationPage {
  constructor(page) {
    this.page = page;
    this.notificationIcon = page.locator('.nav-notifications .dropdown-toggle');
    this.notificationDropdown = page.locator('.nav-notifications .dropdown-menu');
    this.notificationsCount = page.locator('.notifications-count');
    this.notificationsList = page.locator('.notifications-list');
    this.notificationItems = page.locator('.notifications-list .notification-item');
  }

  /**
   * Checks for notifications matching the expected pattern
   * @returns {Promise<boolean>} True if matching notification found
   */
  async checkNotifications() {
    try {
      const expectedTitle = config.variables.topicTitle;
      const expectedTrainer = config.variables.Trainer;
      const expectedPattern = new RegExp(
        `New forum topic ${expectedTitle} has been created by ${expectedTrainer}`, 'i'
      );

      // Keep original modal close logic as requested
      await this.page.locator('#dashboardVideoModal').getByText('×').click();
      await this.page.waitForTimeout(1000); // Reduced from 5000ms for optimization

      // Get notification count before clicking
      await this.checkNotificationCount();
      
      // Open notification dropdown
      await this.openNotificationDropdown();
      
      // Get notifications and validate
      const count = await this.notificationItems.count();
      console.log(`🔢 Found ${count} notifications`);
      
      if (count === 0) {
        await this.handleEmptyNotifications();
        return false;
      }

      // Check the first notification
      return await this.validateFirstNotification(expectedPattern, expectedTitle);
    } catch (error) {
      console.error('❌ Error in notification check:', error.message);
      await this.page.screenshot({ path: 'notification-error.png' });
      return false;
    }
  }

  /**
   * Checks and logs the notification count from badge
   */
  async checkNotificationCount() {
    const countText = await this.notificationsCount.innerText().catch(() => '0');
    console.log(`🔔 Notification badge count: ${countText}`);
    
    if (countText === '0') {
      console.log('⚠️ No notifications according to the badge count');
    }
  }

  /**
   * Opens the notification dropdown and waits for it to be visible
   */
  async openNotificationDropdown() {
    // Ensure page is stable before proceeding
    await this.page.waitForLoadState('networkidle');
    
    // Click notification icon and wait for dropdown
    console.log('🔍 About to click notification icon');
    await this.notificationIcon.click();
    console.log('🔍 Clicked notification icon');
    
    // Wait for dropdown to be visible
    await expect(this.notificationDropdown).toBeVisible({ timeout: 5000 });
    console.log('✅ Notification dropdown is visible');

    // Wait for content to load (reduced from 2000ms)
    await this.page.waitForTimeout(1000);
  }

  /**
   * Handles the case when no notifications are found
   */
  async handleEmptyNotifications() {
    console.log('❌ No notifications found in the dropdown');
    
    // Check dropdown content for debugging
    const listHTML = await this.notificationsList.innerHTML();
    console.log('Notifications list HTML:', listHTML.substring(0, 200) + '...');
    
    // Check if empty message is visible
    const emptyRow = await this.page.locator('.empty-row').isVisible();
    if (emptyRow) {
      console.log('⚠️ Empty notifications message is visible');
    }
    
    // Take a screenshot for debugging
    await this.page.screenshot({ path: 'empty-notifications.png' });
  }

  /**
   * Validates if the first notification matches the expected pattern
   * @param {RegExp} expectedPattern - Pattern to match against
   * @param {string} expectedTitle - Expected topic title for logging
   * @returns {Promise<boolean>} True if notification matches pattern
   */
  async validateFirstNotification(expectedPattern, expectedTitle) {
    const firstNotification = this.notificationItems.first();
    const messageText = await firstNotification.locator('.message').innerText();
    console.log('🔔 First notification message:', messageText);

    // Check if notification matches expected pattern
    if (messageText && expectedPattern.test(messageText)) {
      console.log(`✅ Notification matches expected format for topic "${expectedTitle}".`);
      return true;
    } else {
      console.log(`❌ Notification mismatch.\nFound: "${messageText}"\nExpected to match: "${expectedPattern}"`);
      return false;
    }
  }
}

module.exports = { NotificationPage };
