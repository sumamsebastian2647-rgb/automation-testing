import { expect } from '@playwright/test';

export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.trainerMenuLink = page.getByRole('link', { name: ' Trainer Management' });
    this.updateLink = page.getByRole('link', { name: 'Update' });
    this.inactivateLink = page.getByRole('link', { name: 'Inactivate Trainer' });
    this.backLink = page.getByRole('link', { name: 'Back' });
  }

  async navigateToTrainerManagement() {
    await this.trainerMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ✅ Get first trainer name from first row (Name column)
  async getFirstTrainerName() {
    const firstTrainerCell = this.page.locator('td.trainers-by-rto-grid[data-col-seq="1"]').first();
    const text = await firstTrainerCell.innerText();
    return text.trim();
  }

  // ✅ Click first row's View icon
  async viewFirstTrainer() {
    const viewIcon = this.page.locator('a[title="view"]').first();
    await viewIcon.click();
    await this.page.waitForLoadState('networkidle');
  }
   // ✅ Click first row's View icon
  async loginAsTrainer() {
    const viewIcon = this.page.locator('a[title="Login as Trainer"]').first();
    await viewIcon.click();
    await this.page.waitForLoadState('networkidle');
  }
  // ✅ Get trainer header (e.g., TFN251039 TLN251039)
 
  async getTrainerHeaderText() {
    const heading = this.page.locator('section.content-header h1.text-left');
    // Wait until the heading is visible and has some text
    await heading.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForFunction(
      (selector) => {
        const el = document.querySelector(selector);
        return el && el.innerText.trim().length > 0;
      },
      'section.content-header h1.text-left',
      { timeout: 20000 }
    );
    const headingText = (await heading.innerText()).trim();
    console.log('📋 Trainer View Page Heading:', headingText);
    return headingText;
  }
  // ✅ Verify update button visible
  async verifyUpdateButtonVisible() {
    await expect(this.updateLink).toBeVisible();
  }
  // ✅ Open update page
  async openUpdatePage() {
    await this.updateLink.click();
    await this.page.waitForLoadState('networkidle');
  }
  // ✅ Inactivate trainer with popup and toast verification
  async inactivateTrainer() {
    console.log('🚫 Clicking Inactivate Trainer link...');
    // 1️⃣ Handle the confirmation popup BEFORE clicking
    this.page.once('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message()); // Logs the popup text
      await dialog.accept(); // Clicks OK
    });
    // 2️⃣ Click the Inactivate Trainer link
    await this.inactivateLink.click();
    // 3️⃣ Wait for network idle (page updates after inactivation)
    await this.page.waitForLoadState('networkidle');
    await this.verifySuccessToast();
  }
  // ✅ Go back to list
  async goBackToList() {
    await this.backLink.click();
    await this.page.waitForLoadState('networkidle');
  }
  // ✅ Verify success toast message with headless mode improvements
async verifySuccessToast() {
  console.log('⏳ Waiting for success toast...');
  
  try {
    // 1. First try the DOM-based approach with improved selectors
    const toast = this.page.locator('.alert.alert-success[role="alert"][data-notify="container"]');
    
    // 2. Wait for it to be in the DOM
    await toast.waitFor({ state: 'attached', timeout: 10000 });
    
    // 3. Check visibility with more reliable method in headless mode
    const isVisible = await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      
      const style = window.getComputedStyle(element);
      return style && 
             style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    }, '.alert.alert-success[role="alert"][data-notify="container"]');
    
    if (!isVisible) {
      console.log('⚠️ Toast is in DOM but may not be visible. Continuing verification anyway...');
    }
    
    // 4. Verify both title and message text
    const titleText = await toast.locator('[data-notify="title"]').textContent();
    const messageText = await toast.locator('[data-notify="message"]').textContent();
    
    console.log(`Found toast - Title: "${titleText}", Message: "${messageText}"`);
    
    // Use includes instead of exact match for more flexibility
    expect(titleText).toMatch(/Well Done!/i);
    expect(messageText).toMatch(/Trainer successfully inactivated/i);
    
    console.log('✅ Trainer successfully inactivated toast verified');
    return true;
    
  } catch (error) {
    console.error(`❌ Toast verification failed: ${error.message}`);
    
    // 5. Check if any alert elements exist at all (debug info)
    const alertCount = await this.page.locator('.alert').count();
    console.log(`Debug: Found ${alertCount} alert elements in DOM`);
    
    // 6. Check for our specific element with JS evaluation
    const toastExists = await this.page.evaluate(() => {
      // Try to find toast by message content rather than visibility
      const messages = Array.from(document.querySelectorAll('[data-notify="message"]'));
      const found = messages.find(el => 
        el.textContent.includes('Trainer successfully inactivated')
      );
      
      return found ? {
        exists: true,
        parentClasses: found.closest('[role="alert"]')?.className || 'no parent',
        isVisible: !!found.offsetParent
      } : { exists: false };
    });
    
    console.log('Toast element detection results:', toastExists);
    
    // 7. Take a screenshot to help debug
    await this.page.screenshot({ path: 'toast-verification-failed.png' });
    
    throw new Error('Toast verification failed - see logs for details');
  }
}



}
