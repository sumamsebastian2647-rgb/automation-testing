class LogoutPage {
  constructor(page) {
    this.page = page;
    this.signOutLink = page.getByRole('link', { name: 'Sign out' });
    this.userProfileImage = page.getByRole('link', { name: 'Image Kerstin Tony' });
  }

  async logout() {
    await this.userProfileImage.click();
    await this.signOutLink.click();
  }
}

module.exports = { LogoutPage };
