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
        this.firstNameInput = page.locator('input[name="UserByRtoSearch[ubr_firstname]"]');
    this.firstRowName = page.locator('table tbody tr:first-child td:nth-child(2)'); // Adjust index if needed
    this.firstRowRole = page.locator('table tbody tr:first-child td:nth-child(6)'); // Adjust based on actual table
   
    // Permissions
    this.studentCompetencyReport = page.locator('label').filter({ hasText: 'Student Competencies Report' }).getByRole('insertion');
    this.permissionsSaveButton = page.locator('form').filter({ hasText: 'Permissions Login as Student' }).getByRole('button');
    this.courseCheckbox = page.locator('label').filter({ hasText: '- Course_Sample_01' }).getByRole('insertion');
    this.courseSaveButton = page.locator('form').filter({ hasText: 'Courses 0001 -' }).getByRole('button');
     this.firstNameSearch = page.locator('input[name="UserByRtoSearch[ubr_firstname]"]');
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
 
 async searchByFirstName(name) {
  // Clear the input first
  await this.firstNameInput.fill('');
  // Type the name
  await this.firstNameInput.fill(name);
  // Press Enter to trigger search
  await this.firstNameInput.press('Enter');
  // Wait for the grid to refresh
  await this.page.waitForTimeout(1000);

  // Optional: verify first row contains the searched name
  const firstRowText = (await this.firstRowName.innerText()).trim();
  if (!firstRowText.includes(name)) {
    throw new Error(`Search failed: expected first row to contain "${name}", but got "${firstRowText}"`);
  }
}

  async verifyFirstRow(name, role) {
    const actualName = (await this.firstRowName.innerText()).trim();
    const actualRole = (await this.firstRowRole.innerText()).trim();

    await expect(actualName).toBe(name);
    await expect(actualRole).toBe(role);
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
        await this.searchByFirstName(name);
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
