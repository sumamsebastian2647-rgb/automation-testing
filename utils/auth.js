const { config } = require('../config/config.js');

async function login(page) {
  await page.goto(config.credentials.baseUrl);
  await page.locator('#loginform-username').fill(config.credentials.username);
  await page.locator('#loginform-password').fill(config.credentials.password);
  await page.locator('#login-button').click();
  await page.waitForLoadState('networkidle');
}

async function logout(page) {
  await page.getByRole('link', { name: config.user.name }).click();
  await page.getByRole('link', { name: 'Sign out' }).waitFor({ state: 'visible' });
  await page.getByRole('link', { name: 'Sign out' }).click();
  await page.waitForLoadState('networkidle');
}

const loginAsAdmin = login;
const logoutAsAdmin = logout;
module.exports = { login, loginAsAdmin,logoutAsAdmin, logout };
