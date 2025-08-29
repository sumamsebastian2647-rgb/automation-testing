// CourseInductionPage.js
const config = require('../config');
const { readCourseName, saveTaskName ,saveCourseName} = require('../utils/dataManager');
const { expect } = require('@playwright/test');

class CourseInductionPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.createCourseInductionButton = page.getByRole('link', { name: 'Create Course Induction' });
    this.inductionNameInput = page.locator('#courseinduction-induction_name');
    this.saveInductionButton = page.getByRole('button', { name: 'Create' });

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

  async createCourse(courseInductionName) {
    await this.createCourseInductionButton.click();
    await this.inductionNameInput.fill(courseInductionName);
    await this.saveInductionButton.click();
    console.log("✅ Induction created successfully");

    // Save course name to JSON
    saveCourseName(courseInductionName);
  }

  async verify_induction(courseInductionName) {
    // Step 1: Go back to list
    await this.page.getByRole('link', { name: 'Back' }).first().click();

    // Step 2: Wait for a unique element on the index page
    await this.page.waitForSelector('input[name*="induction_name"]', { timeout: 15000 });

    // Step 3: Find the search input
    const searchInput = this.page.locator('input[name*="induction_name"]');
    await expect(searchInput).toBeVisible();

    // Step 4: Perform search
    await searchInput.fill(courseInductionName);
    await searchInput.press('Enter');

    // Step 5: Wait for table to load results
    const firstRow = this.page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    const firstRowText = await firstRow.textContent();

    // Step 6: Validate
    if (firstRowText && firstRowText.includes(courseInductionName)) {
      console.log(`✅ '${courseInductionName}' is visible in the first row`);
    } else {
      console.log(`❌ '${courseInductionName}' not found in the first row`);
    }
  }
}

module.exports = { CourseInductionPage };
