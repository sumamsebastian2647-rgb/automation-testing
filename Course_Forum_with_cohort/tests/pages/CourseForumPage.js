const config = require('../../config');

class CourseForumPage {
  constructor(page) {
    this.page = page;
    this.courseInput = page.getByRole('textbox', { name: 'Course' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.courseLink = page.getByRole('link', { name: config.variables.courseFullName });
    this.createTopicLink = page.getByRole('link', { name: 'Create Topic' });
    this.categorySelect = page.getByLabel('Category');
    this.titleInput = page.getByRole('textbox', { name: 'Title*' });
    this.descriptionEditor = page.locator('.redactor-editor');
    this.cohortsSearchbox = page.getByRole('searchbox', { name: 'Select course cohorts' });
    this.cohortOption = page.getByRole('option', { name: config.variables.cohort });
    this.submitButton = page.getByRole('form').filter({ hasText: 'Category Announcement' }).getByRole('button');
  }

  async searchCourse(courseName) {
    await this.courseInput.fill(courseName);
    await this.courseInput.press('Enter');
    await this.searchButton.click();
    await this.courseLink.click();
  }

  async createTopic(title, description) {
    await this.createTopicLink.click();
    await this.categorySelect.selectOption('1');
    await this.titleInput.fill(title);
    await this.descriptionEditor.type(description);
    await this.cohortsSearchbox.click();
    await this.cohortOption.click();
    await this.submitButton.click();
  }
}

module.exports = { CourseForumPage };
