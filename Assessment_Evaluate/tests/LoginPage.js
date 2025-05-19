// LoginPage.js
const config = require('../config');  // Direct import

class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#loginform-username');
        this.passwordInput = page.locator('#loginform-password');
        this.loginButton = page.locator('#login-button');
    }

    async login(username, password) {
        await this.page.goto(config.credentials.baseUrl);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { LoginPage };
