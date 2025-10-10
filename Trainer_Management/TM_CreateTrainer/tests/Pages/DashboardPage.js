// ./Pages/DashboardPage.js
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.trainerManagementLink = page.getByRole('link', { name: ' Trainer Management' });
    this.createTrainerButton = page.getByRole('link', { name: 'Create Trainer' });
  }

  async openTrainerManagement() {
    await this.trainerManagementLink.click();
  }

  async isCreateTrainerButtonVisible() {
    return await this.createTrainerButton.isVisible();
  }
}
module.exports={DashboardPage};