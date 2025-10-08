class LogoutPage {
  constructor(page) {
    this.page = page;
    this.userProfileImage = page.getByRole('link', { name: 'Image Ali Kadri' });
    this.SMProfileImage = page.getByRole('link', { name: 'Image Jane Angel' });
    this.signOutLink = page.getByRole('link', { name: 'Sign out' });
  }

  async logout() {
    await this.userProfileImage.click();
    await this.signOutLink.click();
  }
   async logoutSm() {
    await this.page.getByRole('link', { name: 'Image Jane Angel' }).click();
    await this.page.getByRole('link', { name: 'Sign out' }).click();
  }
}

module.exports = { LogoutPage };
