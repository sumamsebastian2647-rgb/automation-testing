class DashboardPage {
  constructor(page) {
    this.page = page;
    // Main menu selectors
    this.courseManagementMenu = page.locator('#course_management > a');
    this.courseForumLink = page.locator('a[href="/course-forum/course"]');
    
    // Alternative selectors as backup
    this.courseManagementByText = page.locator('a:has-text("Course Management")');
    this.courseForumByText = page.locator('a:has-text("Course Forum")');
  }

  /**
   * Navigates to the Course Forum page by expanding the Course Management menu
   * and clicking the Course Forum link
   */
  async navigateToCourseForum() {
    console.log('🔍 Navigating to Course Forum...');
    
    try {
      // Close any modals if present
      const modalClose = this.page.locator('#dashboardVideoModal button.close');
      if (await modalClose.isVisible().catch(() => false)) {
        await modalClose.click();
        await this.page.waitForTimeout(500);
      }
      
      // Check if Course Management menu is already open
      const isMenuOpen = await this.page.locator('#course_management.menu-open').isVisible()
        .catch(() => false);
      
      if (!isMenuOpen) {
        console.log('🔍 Opening Course Management menu...');
        await this.courseManagementMenu.click();
        await this.page.waitForTimeout(500); // Short wait for menu animation
      } else {
        console.log('✅ Course Management menu is already open');
      }
      
      // Now check if Course Forum link is visible
      const isForumLinkVisible = await this.courseForumLink.isVisible()
        .catch(() => false);
      
      if (!isForumLinkVisible) {
        console.log('⚠️ Course Forum link not visible after opening menu, trying alternative approach...');
        await this.tryAlternativeNavigation();
      } else {
        console.log('✅ Course Forum link is visible, clicking...');
        await this.courseForumLink.click();
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
        console.log('✅ Successfully navigated to Course Forum page');
      }
    } catch (error) {
      console.error('❌ Error navigating to Course Forum:', error.message);
      await this.page.screenshot({ path: 'course-forum-navigation-error.png' });
      
      // Fallback: Direct navigation
      console.log('🔄 Attempting direct navigation to Course Forum...');
      await this.page.goto('/course-forum/course');
    }
  }
  
  /**
   * Alternative navigation approach if the primary method fails
   */
  async tryAlternativeNavigation() {
    // Approach 1: Try to find and click the link by text content
    try {
      // First try to ensure Course Management menu is open by text
      const managementMenu = this.courseManagementByText;
      const isManagementVisible = await managementMenu.isVisible().catch(() => false);
      
      if (isManagementVisible) {
        await managementMenu.click();
        await this.page.waitForTimeout(500);
      }
      
      // Then try to find Course Forum by text
      const forumLink = this.courseForumByText;
      const isForumVisible = await forumLink.isVisible().catch(() => false);
      
      if (isForumVisible) {
        await forumLink.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    } catch (error) {
      console.log('Alternative approach 1 failed:', error.message);
    }
    
    // Approach 2: Try to find any Course Forum link in the treeview
    try {
      const treeviewLinks = this.page.locator('.treeview-menu a');
      const count = await treeviewLinks.count();
      
      for (let i = 0; i < count; i++) {
        const text = await treeviewLinks.nth(i).innerText();
        if (text.includes('Course Forum')) {
          console.log('🔍 Found Course Forum link in treeview, clicking...');
          await treeviewLinks.nth(i).click();
          await this.page.waitForLoadState('networkidle');
          return;
        }
      }
    } catch (error) {
      console.log('Alternative approach 2 failed:', error.message);
    }
    
    // Last resort: Direct navigation
    console.log('⚠️ All approaches failed, using direct URL navigation');
    await this.page.goto('/course-forum/course');
  }
}

module.exports = { DashboardPage };
