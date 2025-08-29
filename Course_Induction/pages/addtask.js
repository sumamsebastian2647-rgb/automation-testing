// AddTask.js
const { expect } = require('@playwright/test');
const { readCourseName, saveTaskName } = require('../utils/dataManager');

class AddTask {
  constructor(page) {
    this.page = page;

    // Navigation locators
    this.courseManagementLink = page.locator('#course_management > a:has-text("Course Management")');
    this.courseInductionLink = page.locator('#course_management .treeview-menu a:has-text("Course Induction")');
// Task locators
    this.addTaskButton = page.locator('#btn-add-task');
    this.taskTitleInput = page.locator('#taskinduction-task_title');
    this.taskDescription = page.locator('.redactor-editor');
    this.saveTaskButton = page.getByRole('button', { name: 'Save Task' });

    // Form locators
    this.taskNameInput = page.locator('#task-task_name');
    this.taskDescriptionInput = page.locator('#task-task_description');
    this.taskDurationInput = page.locator('#task-task_duration');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async gotoCourseInductionList() {
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

  async openInductionFromJson() {
    const courseInductionName = readCourseName();
    if (!courseInductionName) {
      throw new Error('❌ No course induction name found in JSON. Run course induction creation first.');
    }
    console.log(`🔎 Searching for Course Induction: ${courseInductionName}`);
    // Search for the course induction
    const searchInput = this.page.locator('input[name*="induction_name"]');
    await searchInput.fill(courseInductionName);
    await searchInput.press('Enter');

    // Click the first result
    await this.page.locator('table tbody tr').first().locator('a[title="Edit"]').click();


  }
async createtask() {
// Click the Add Task button
await this.page.locator('#btn-add-task').click();

// Wait for the modal (try both AJAX & Bootstrap cases)
await this.page.locator('#taskinduction-task_title').waitFor({ state: 'visible', timeout: 10000 });

// Generate a unique task name
const taskName = `Task_${Date.now()}`;

// Fill the Task Title input
await this.page.locator('#taskinduction-task_title').fill(taskName);

console.log("✅ Task name added:", taskName);

//  await this.page.fill('#taskinduction-task_title', taskName);



  // Fill the form fields

  await this.taskDescription.click();
  await this.taskDescription.type('Fill task data');
  console.log("✅ Task form filled");
  
  // Add additional fields
  await this.addFieldsToForm();
  await this.page.waitForTimeout(2000);

  // Save the task and wait for successful response
  await Promise.all([
    this.page.waitForResponse(res => res.url().includes('course-induction') && res.status() === 200),
    this.saveTaskButton.click()
  ]);
  console.log("✅ Clicked 'Save Task'");
  
  // Save task name to JSON
  saveTaskName(taskName);
  console.log(`✅ Task '${taskName}' created and saved to JSON`);
}


  async addFieldsToForm() {
    try {
      console.log("▶️ Starting to add fields to form...");

      if (!this.page.isClosed()) {
        await this.page.screenshot({ path: 'form-builder-state.png' });
      }

      // Text field locator candidates
      const textFieldLocators = [
        this.page.getByText("Text Field", { exact: true }),
        this.page.locator("li:has-text('Text Field')"),
        this.page.locator(".task-template-panel li:has-text('Text Field')"),
        this.page.locator("[data-field-type='text'], [data-type='text']"),
        this.page.locator("li.field-type-text, li[data-field='text']")
      ];

      // Number field locator candidates
      const numberFieldLocators = [
        this.page.getByText("Number", { exact: true }),
        this.page.locator("li:has-text('Number')"),
        this.page.locator(".task-template-panel li:has-text('Number')"),
        this.page.locator("[data-field-type='number'], [data-type='number']"),
        this.page.locator("li.field-type-number, li[data-field='number']")
      ];

      // Try to click text field
      let textFieldFound = await this.tryLocators(textFieldLocators, "Text Field");

      // Try to click number field
      let numberFieldFound = await this.tryLocators(numberFieldLocators, "Number");

      // Fallback: search list items manually
      if (!textFieldFound || !numberFieldFound) {
        const listItems = this.page.locator('li');
        const count = await listItems.count();
        console.log(`Found ${count} list items`);

        for (let i = 0; i < count; i++) {
          const text = (await listItems.nth(i).textContent()) || '';
          if (text.includes('Text Field') && !textFieldFound) {
            await listItems.nth(i).click();
            console.log(`✅ Clicked list item ${i} as Text Field`);
            textFieldFound = true;
          } else if (text.includes('Number') && !numberFieldFound) {
            await listItems.nth(i).click();
            console.log(`✅ Clicked list item ${i} as Number Field`);
            numberFieldFound = true;
          }
          if (textFieldFound && numberFieldFound) break;
        }
      }

      if (!this.page.isClosed()) {
        await this.page.screenshot({ path: 'after-field-attempts.png' });
      }
      console.log("✅ Completed field addition attempts");

    } catch (error) {
      console.error("❌ Error adding fields to form:", error);
      try {
        if (!this.page.isClosed()) {
          await this.page.screenshot({ path: 'field-addition-error.png' });
        }
      } catch (e) {
        console.warn("⚠️ Could not take error screenshot, page closed.");
      }
    }
  }

  async tryLocators(locators, fieldName) {
    for (let i = 0; i < locators.length; i++) {
      const count = await locators[i].count();
      if (count > 0) {
        try {
          await locators[i].first().scrollIntoViewIfNeeded();
          await locators[i].first().click();
          console.log(`✅ Clicked ${fieldName} with locator strategy ${i + 1}`);
          await this.page.waitForTimeout(1000);
          return true;
        } catch (e) {
          console.log(`⚠️ Failed ${fieldName} with locator strategy ${i + 1}: ${e}`);
        }
      }
    }
    return false;
  }


}

module.exports = { AddTask };
