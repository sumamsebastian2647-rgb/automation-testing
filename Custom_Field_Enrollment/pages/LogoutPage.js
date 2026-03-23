class LogoutPage {
  constructor(page) {
    this.page = page;
    this.signOutLink = page.getByRole('link', { name: 'Sign out' });
    this.userProfileImage = page.getByRole('link', { name: 'Image Ali Kadri' });
    this.studentprofileImage = page.getByRole('link', { name: 'Image Navamy John' });
    this.trainerprofileImage = page.getByRole('link', { name: 'Image Kerstin Tony' });
  }

  async logout() {
    await this.userProfileImage.click();
    await this.signOutLink.click();
  }
  async logoutstudent() {
    await this.studentprofileImage.click();
    await this.signOutLink.click();
  }
  async logouttrainer() {
    await this.trainerprofileImage.click();
    await this.signOutLink.click();
  }
}

module.exports = { LogoutPage };
