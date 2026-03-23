const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
  }
  async closeDashboardModalIfVisible() {
    const closeBtn = this.page.locator('.close-dashboard-modal');
    try {
      // Wait briefly if modal appears
      await closeBtn.waitFor({ state: 'visible', timeout: 2000 });
      // Click to close
      await closeBtn.click();
      // Optional: wait for modal to disappear
      await this.page.waitForSelector('.close-dashboard-modal', { state: 'detached', timeout: 2000 });
    } catch {
      // ✅ Modal not present → safe to continue
    }
  }

    // ================= TOP MENU =================
  async topMenuNavigation() {
    await this.page.click('#coursemenu > a > i');
    await this.captureToastIfAny();
    await this.page.click('#mycertificatesmenu span');
    await this.captureToastIfAny();
    await this.page.click('#myprofilemenu span');
    await this.captureToastIfAny();
    await this.page.click('a[href="/student/settings"]');
    await this.captureToastIfAny();
    await this.page.click('.glyphicon');
    await this.captureToastIfAny();
    await this.page.click('#menuchangepassword > a > span');
    await this.captureToastIfAny();
  }

  // ================= COURSES =================
  async coursesFlow() {
    await this.page.waitForSelector('#coursemenu > a', { state: 'visible' });
    await this.page.click('#coursemenu > a');
     await this.captureToastIfAny();
    await this.page.waitForSelector('#select2-course-filter-dropdown-container', { state: 'visible' });
    await this.page.click('#select2-course-filter-dropdown-container');
   await this.captureToastIfAny();
    await this.page.click("[data-filter='all']");
     await this.captureToastIfAny();
    await this.page.click("[data-filter='in-progress'] span");
     await this.captureToastIfAny();
    await this.page.click("[data-filter='competent'] span");
     await this.captureToastIfAny();
    await this.page.click("[data-filter='unpaid'] span");
     await this.captureToastIfAny();

    await this.page.waitForSelector('.courses-card-img', { state: 'visible' });
    await this.page.click('.courses-card-img');
     await this.captureToastIfAny();
  }

  // ================= LEFT MENU =================
  async leftMenuFlow() {
    await this.page.waitForSelector('.main-sidebar .active a', { state: 'visible' });
    await this.page.click('.main-sidebar .active a');

    await this.page.click('.sidebar-menu > :nth-child(7) a');
    await this.page.click('#heading2643 h4 span');

    await this.page.waitForSelector(
      '.learningmaterial > :nth-child(2) > :nth-child(3) .img-lg',
      { state: 'visible' }
    );
    await this.page.click('.learningmaterial > :nth-child(2) > :nth-child(3) .img-lg');

    await this.page.click('.sidebar-menu > :nth-child(8) span');
    await this.page.click('.sidebar-menu > :nth-child(9) a');
    await this.page.click('.sidebar-menu > :nth-child(10) span');
    await this.page.click('.sidebar-menu > :nth-child(11) span');
    await this.page.click('.sidebar-menu > :nth-child(12) span');

    await this.page.waitForSelector('.call-employer', { state: 'visible' });
    await this.page.click('.call-employer');

    await this.page.waitForSelector('#modal-employer .close', { state: 'visible' });
    await this.page.click('#modal-employer .close');

    await this.page.waitForSelector('.call-loader', { state: 'visible' });
    await this.page.click('.call-loader');

    await this.page.waitForSelector("[id^='modalReport'] [type='button']", { state: 'visible' });
    await this.page.click("[id^='modalReport'] [type='button']");

    await this.page.click('.sidebar-menu > :nth-child(15) span');
    await this.page.click('.sidebar-menu > :nth-child(16) a');
  } 

  // ================= CERTIFICATES =================
  async certificatesFlow() {
    await this.page.waitForSelector('#mycertificatesmenu span', { state: 'visible' });
    await this.page.click('#mycertificatesmenu span');
    await this.captureToastIfAny();

    await this.page.waitForSelector('.cert-image-overlay', { state: 'visible' });
    await this.page.click('.cert-image-overlay');
    await this.captureToastIfAny();
 
    await this.page.waitForSelector('#certificates-grid .btn-primary-action span', { state: 'visible' });
    await this.page.click('#certificates-grid .btn-primary-action span');
    await this.captureToastIfAny();

    await this.page.waitForSelector('.fa-eye', { state: 'visible' });
    await this.page.click('.fa-eye');
    await this.captureToastIfAny();

    await this.page.waitForSelector('.cert-action-buttons > :nth-child(2) span', { state: 'visible' });
    await this.page.click('.cert-action-buttons > :nth-child(2) span');
    await this.captureToastIfAny();
  }

  // ================= DASHBOARD WIDGETS =================
  async dashboardWidgets() {
    await this.page.click('.main-header .logo-lg');

    await this.page.waitForSelector('#assessment-summary-link', { state: 'visible' });
    await this.page.click('#assessment-summary-link');

    await this.page.waitForSelector('#assessmentSummaryModal .close', { state: 'visible' });
    await this.page.click('#assessmentSummaryModal .close');

    await this.page.waitForSelector('.dashboard-view-all-btn', { state: 'visible' });
    await this.page.click('.dashboard-view-all-btn');

    await this.page.click('.main-header .logo-lg');

    await this.page.waitForSelector('#watchVideoDropdown', { state: 'visible' });
    await this.page.click('#watchVideoDropdown');

    await this.page.waitForSelector('#dashboardVideoModal button', { state: 'visible' });
    await this.page.click('#dashboardVideoModal button');

    await this.page.click('.bottom-grid > :nth-child(1) .dashboard-widget-title');
    await this.page.click('.bottom-grid > :nth-child(2) .dashboard-widget-title');
    await this.page.click('.bottom-grid > :nth-child(3) .dashboard-widget-title');
  }

  // ================= HEADER LINKS =================
  async headerLinks() {
    await this.page.waitForSelector('#assessor-link', { state: 'visible' });
    await this.page.click('#assessor-link');
    await this.page.click('#logo');

    await this.page.waitForSelector('#chat-link', { state: 'visible' });
    await this.page.click('#chat-link');
    await this.page.click('.main-header .logo-lg');

    await this.page.waitForSelector('#forum-link', { state: 'visible' });
    await this.page.click('#forum-link');
    await this.page.click('#logo');
  }

  // ================= LOGOUT =================
  async logout() {
    await this.page.waitForSelector('#menuchangepassword > a > span', { state: 'visible' });
    await this.page.click('#menuchangepassword > a > span');

    await this.page.waitForSelector('#btnLogout', { state: 'visible' });
    await this.page.click('#btnLogout');
  }

  // ================= TOAST HANDLING (FINAL & STABLE) =================

async waitForToastMessage() {
  const message = this.page.locator('span[data-notify="message"]');

  await message.waitFor({
    state: 'visible',
    timeout: 8000 // 👈 increased wait
  });

  return message;
}

async getToastMessage() {
  const message = await this.waitForToastMessage();
  return (await message.innerText()).trim();
}

async verifyToastMessage(expectedText) {
  const actualMessage = await this.getToastMessage();
  await expect(actualMessage).toContain(expectedText);
}
async captureToastIfAny() {
  const toast = this.page.locator('span[data-notify="message"]');

  try {
    // Wait briefly for toast to appear
    await toast.waitFor({ state: 'attached', timeout: 2000 });

    const message = await toast.innerText();
    console.log('❌ Toast Message:', message.trim());

    // OPTIONAL: small pause so UI settles
    await this.page.waitForTimeout(500);

  } catch {
    // ✅ No toast → continue safely
  }
}


}

module.exports = DashboardPage;
