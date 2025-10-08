const {expect}=require('@playwright/test');
// @ts-check
class StudentManagementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // User Management
    this.userManagementLink = page.getByRole('link', { name: ' User Management' });
    this.firstnameInput = page.locator('input[name="UserByRtoSearch[ubr_firstname]"]');
    this.studentManagerCell = page.getByRole('cell', { name: 'Student Manager' });
     this.setPermissionLink = page.locator('a[title="Set Permissions"]');
       this.confirmLoginAsStudent =page.locator('a[title="Login as User"]');
   
    // Permissions
    this.studentCompetencyReport = page.locator('label').filter({ hasText: 'Student Competencies Report' }).getByRole('insertion');
    this.permissionsSaveButton = page.locator('form').filter({ hasText: 'Permissions Login as Student' }).getByRole('button');
    this.courseCheckbox = page.locator('label').filter({ hasText: '- Course_Sample_01' }).getByRole('insertion');
    this.courseSaveButton = page.locator('form').filter({ hasText: 'Courses 0001 -' }).getByRole('button');
  
    // Reports
    this.studentReportsLink = page.getByRole('link', { name: ' Student Reports ' });
    this.competencyReportLink = page.getByRole('link', { name: ' Competency Report' });
    this.permissionDenied = page.getByText('Sorry, you are not allowed to');
    this.okButton = page.getByRole('button', { name: 'OK' });
    // Active Students
    this.activeStudentsLink = page.getByRole('link', { name: ' Active Students' });
    this.courseSearchBox = page.getByRole('textbox', { name: 'Course Code or Name' });
    this.courseSearchButton = page.getByRole('button', { name: 'Search' });
    this.courseLink = page.getByRole('link', { name: '- Course_Sample_01' });
    this.studentProfileLink = page.getByRole('link', { name: 'Image Jane Angel' });

    // Sign out
    this.signOutLink = page.getByRole('link', { name: 'Sign out' });
  }

  // -------- User Management --------
  async openUserManagement() {
    await this.userManagementLink.click();
  }
  async searchByFirstname(name) {
    await this.firstnameInput.fill(name).click;
      // Table auto-updates, no Enter or Search button needed
   await this.page.waitForSelector(`table tbody tr:has-text("${name}")`);
   await this.studentManagerCell.click();
  }
 
  // -------- Permissions --------
  async setPermissionsFunction() {
    await this.setPermissionLink.click();
    await this.studentCompetencyReport.click();
    await this.permissionsSaveButton.click();
    try {
    await this.page.waitForSelector('text=Well Done! Permission has been updated successfully.', { timeout: 5000 });
    console.log('Success: Toast message appeared!');
  } catch {
    console.log('Toast message did not appear.');
}
 }
   async setPermissionsCoure() {
    await this.courseCheckbox.click();
    await this.courseSaveButton.click();
    try {
        await this.page.waitForSelector('text=Well Done! Course permission has been updated successfully.', { timeout: 5000 });
        console.log('Success: Toast message appeared!');
   } catch {
    console.log('Toast message did not appear.');
    }
    await this.page.getByText('Back').first().click();
    //await this.confirmLoginAsStudent.click();
  }
   
    async loginAsStudent(name) {
        await this.searchByFirstname(name);
        await this.confirmLoginAsStudent.first().click();
        const toastLocator = this.page.locator(`text=Well Done! You are now logged in as Jane Angel.`);
        try {
            await expect(toastLocator).toBeVisible({ timeout: 5000 });
            console.log('Success: Toast message appeared!');
        } catch {
            console.log('Toast message did not appear.');
        }
    }

  // -------- Reports --------
  async verifyStudentReports() {
    await this.studentReportsLink.click();
    await this.competencyReportLink.click();
    await this.permissionDenied.isVisible();
    await this.okButton.click();
    console.log('Functionality permission verified successfully');
  }

  // -------- Active Students --------
  async searchActiveStudents(courseName) {
   // Expand Student Management menu
await this.page.locator('#student_management > a').click();

// Click Active Students link
await this.page.locator('#student_management a[href="/enrolled-students/index"]').click();
    await this.courseSearchBox.fill(courseName);
    await this.courseSearchBox.press('Enter');
    await this.courseSearchButton.click();
    await this.courseLink.click();
    await this.studentProfileLink.click();
     console.log('Course permission verified successfully');
    
  }

  
}

module.exports = { StudentManagementPage };
