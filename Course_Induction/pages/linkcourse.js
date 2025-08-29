// Addtask.js
const { expect } = require('@playwright/test');
const config = require('../config');

class LinkCourse {
    constructor(page) {
        this.page = page;

        // Navigation locators
        this.courseManagementLink = page.locator('#course_management > a:has-text("Course Management")');
        this.courseInductionLink = page.locator('#course_management .treeview-menu a:has-text("Course Induction")');
    }

         async goto_induction() {
            // Step 1: Ensure Course Management is visible (typo fixed)
            await this.courseManagementLink.scrollIntoViewIfNeeded();
            // Try hover first
            await this.courseManagementLink.hover();
            await this.page.waitForTimeout(1000); // give time for animation
            // If still hidden, fall back to click
            if (!(await this.courseInductionLink.isVisible())) {
            await this.courseManagementLink.click();
            await this.page.waitForTimeout(1000);
            }
            // Step 2: Click Course Induction
            await this.courseInductionLink.click();
            // Step 3: Confirm navigation
            await this.page.waitForURL('**/course-induction/index');
            console.log("✅ Navigated to Course Induction");
  }

        async link_induction() {
            await this.page.locator('table tbody tr:first-child a[title="Link to Course"]').click();
            //await this.page.waitForURL('**/course-induction/update?id=*');
            console.log("✅ Opened induction link to course page");
        }

        async link() {

                     
                const modal = this.page.locator('.modal-content');
                await expect(modal).toBeVisible();

                // Search for course
                await modal.locator('#courseSearch').fill(config.course.name);
                await modal.locator('#courseSearch').press('Enter');

                // Wait for search results
                const courseRow = modal.locator('tr', { hasText: config.course.name});
                await expect(courseRow).toBeVisible();

                // Select checkbox
             // Click on the cell containing the checkbox which might be easier to target
                await courseRow.locator('td').first().locator('input[type="checkbox"]').check();
                               // Save (no navigation expected)
                await modal.locator('#saveCourseLinks').click();

                // Verify modal closed
                await expect(modal).toBeHidden();


        }

}
module.exports = { LinkCourse };
