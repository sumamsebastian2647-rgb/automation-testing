const { expect } = require('@playwright/test');

class ProgressPage {
    constructor(page) {
        this.page = page;

        // Progress statistics
        this.notStarted = this.page.locator('.lln-stat-ns span');
        this.inProgress = this.page.locator('.lln-stat-ip span');
        this.completed = this.page.locator('.lln-stat-done span');

        // Progress bar
        this.progressBar = this.page.locator('#llnProgressFill');
    }

    async verifyLearningProgress() {

        // Get text from UI
        const notStartedText = await this.notStarted.textContent();
        const inProgressText = await this.inProgress.textContent();
        const completeText = await this.completed.textContent();

        // Extract numbers
        const notStartedCount = parseInt(notStartedText);
        const inProgressCount = parseInt(inProgressText);
        const completedCount = parseInt(completeText);

        // Calculate total tasks
        const totalTasks = notStartedCount + inProgressCount + completedCount;

        // Calculate expected progress
        const expectedPercent = Math.round((completedCount / totalTasks) * 100);

        // Get progress bar width
        const style = await this.progressBar.getAttribute('style');
        const uiPercent = parseInt(style.match(/\d+/)[0]);

        console.log(`Not Started: ${notStartedCount}`);
        console.log(`In Progress: ${inProgressCount}`);
        console.log(`Completed: ${completedCount}`);
        console.log(`Total Tasks: ${totalTasks}`);
        console.log(`Expected Progress: ${expectedPercent}%`);
        console.log(`UI Progress: ${uiPercent}%`);

        // Assertion
        expect(uiPercent).toBe(expectedPercent);
    }
}

module.exports = ProgressPage;