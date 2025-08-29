const {expect}= require('@playwright/test');
const  config = require('../config.js');
const {readTaskName}=require('../utils/dataManager.js');

class ReviewTask {
    constructor(page){
        this.page=page;
         this.studentManagementLink=page.getByRole('link', { name: ' Student Management ' });
         this.activeStudentsLink=page.locator('a[href="/enrolled-students/index"]');
         this.enrolledStudentsSearchInput=page.locator('input[name="EnrolledStudentsSearch[name]"]');
         this.courseCodeOrNameTextbox=page.getByRole('textbox', { name: 'Course Code or Name' });
         this.searchButton=page.getByRole('button', { name: 'Search' });
         this.enrolledStudentsSearchNameInput=page.locator('input[name="CourseStudentsSearch[student_name]"]');
     }
     async goto_induction() {
    // Step 1: Wait for page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    
    // Step 2: Check if Student Management menu is already expanded
    const isActiveStudentsVisible = await this.page.locator('a[href="/enrolled-students/index"]').isVisible();
    
    if (!isActiveStudentsVisible) {
        // Click the Student Management parent to expand the menu
        await this.page.locator('#student_management > a').click();
        
        // Wait for the submenu to expand
        await this.page.waitForTimeout(500); // Brief wait for animation
    }
    
    // Step 3: Click on Active Students link
    await this.page.locator('a[href="/enrolled-students/index"]').click();
    
    // Step 4: Wait for the Active Students page to load
    await this.page.waitForLoadState('networkidle');
    
    // Step 5: Enter course name in search box
    await this.courseCodeOrNameTextbox.click();
    await this.courseCodeOrNameTextbox.fill(config.course.name);
    
    // Step 6: Click search button
    await this.searchButton.click();
    
    // Step 7: Wait for search results and click on the course
    await this.page.waitForLoadState('networkidle');
    await this.page.getByRole('link', { name: config.course.name }).click();
    
    // Step 8: Wait for course page to load
    await this.page.waitForLoadState('networkidle');
    
    // Step 9: Search for specific student
    await this.page.locator('input[name="CourseStudentsSearch[student_name]"]').click();
    await this.page.locator('input[name="CourseStudentsSearch[student_name]"]').fill(config.student.name);
    await this.page.locator('input[name="CourseStudentsSearch[student_name]"]').press('Enter');
    
    // Step 10: Wait for student search results
    await this.page.waitForTimeout(2000);
    await this.page.waitForSelector('tbody tr', { state: 'visible' });
    
    // Step 11: Find and click the view competencies button for the first student
    const firstRow = this.page.locator('tbody tr').first();
    const viewCompetenciesBtn = firstRow.locator('a[title="View competencies of the student"]');
    
    // Ensure button is in view and click
    await viewCompetenciesBtn.scrollIntoViewIfNeeded();
    await viewCompetenciesBtn.click();
    
    // Step 12: Wait for competencies page to load
    await this.page.waitForLoadState('networkidle');
}

  
    async goto_task() {
        const taskName = readTaskName();
        if (!taskName) throw new Error('❌ Task name not found in JSON');
            // Updated locator to include "Submitted" status
        const taskCard = this.page.locator(
        `//div[contains(@class, "box-primary")]//h3[contains(., "${taskName}")]
        /ancestor::div[contains(@class, "box-primary")][.//span[contains(text(), "Submitted")]]`
        );
            await expect(taskCard).toBeVisible({ timeout: 10000 });
            // Click the "Go to Task" button inside this card
        await taskCard.getByRole('link', { name: 'Go to Task' }).click();
    }
    async markTaskAsSatisfactory() {
    // Click the Satisfactory button
        await this.page.locator('#btn-approve-task').click();
            // Wait for the SweetAlert2 dialog to appear
        await this.page.waitForSelector('.swal2-popup.swal2-show', { state: 'visible' });
            // Click the "Yes, approve it!" confirmation button
        await this.page.locator('.swal2-confirm').click();
            // Wait for the dialog to close and page to update
        await this.page.waitForSelector('.swal2-popup.swal2-show', { state: 'hidden', timeout: 5000 });
        await this.page.waitForLoadState('networkidle');
    }

}
module.exports={ ReviewTask };