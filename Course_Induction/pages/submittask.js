// SubmitTask.js
const { expect } = require('@playwright/test');
const config = require('../config');
const { readTaskName} = require('../utils/dataManager');

class SubmitTask {
  constructor(page) {
    this.page = page;
    this.modal = this.page.locator('#dashboardVideoModal');
    this.modalClose = this.page.locator('#dashboardVideoModal button.close');
  }

  async goto_induction() {
      // Close modal if visible
      if (await this.modal.isVisible()) {
        await this.modalClose.click();
      }
       await this.page.getByRole('link', { name: 'Courses' }).click();
       // Click course name from config
  const courseLink = this.page.locator('a', { hasText: config.course.name });
  await expect(courseLink).toBeVisible({ timeout: 10000 });
  await courseLink.first().click(); // .first() handles case if multiple match


      // Or if you want the "enrolled in" version, change it to:
      // await this.page.locator('a', { hasText: `You have been enrolled in course ${config.course.name}` }).click();
      // Now click induction
      await this.page.getByRole('button', { name: /Induction/ }).click();
  }
   async goto_task() {
      const taskName = readTaskName();
      if (!taskName) throw new Error('❌ Task name not found in JSON');
      // Locate the task card with matching name and "Not Started"
      const taskCard = this.page.locator(
        `//div[contains(@class, "col-md-4")]//div[contains(., "${taskName}")]
        //span[normalize-space(.)="Not Started" or normalize-space(.)="In Progress"]
        /ancestor::div[contains(@class, "col-md-4")]`
      );
      await expect(taskCard).toBeVisible({ timeout: 10000 });
      // Click the "Go to Task" button inside this card
      await taskCard.getByRole('link', { name: 'Go to Task' }).click();
  }
   async fillTaskForm() {
        // Fill text field
      await this.page.getByRole('textbox').fill('ererere');
        // Fill number field
      await this.page.getByRole('spinbutton').fill('45454');
   }
async submitTask() {
      // Click Submit Task button
      await this.page.locator('#submit-btn').click({ force: true });
      await this.page.waitForTimeout(3000);
      await this.page.screenshot({ path: 'after_submit.png' });
      console.log(await this.page.content());

    // Wait for SweetAlert2 confirmation popup
      const confirmButton = this.page.locator('button.swal2-confirm', { hasText: /submit/i });
      await confirmButton.waitFor({ state: 'visible', timeout: 15000 });
    await confirmButton.click();
      // Optionally wait for success message after confirmation
      await this.page.waitForSelector('.swal2-success', { timeout: 10000 }); // adjust selector to your success message
      // Optional: wait for success message or redirection
      await this.page.waitForTimeout(2000); // replace with expect() for proper check
}

}

module.exports = { SubmitTask };
