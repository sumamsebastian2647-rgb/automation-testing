const {test,expect} = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LogoutPage } = require('../pages/LogoutPage');
const { ReviewTask } = require('../pages/reviewtask.js');   
const config=require('../config.js');

test ('Reviewtask', async ({page}) =>{
    test.setTimeout(60000);
    const login=new LoginPage(page);
    const review=new ReviewTask(page);
    const logoff=new LogoutPage(page);

    await login.goto();
    await login.login(config.credentials.trainerusername, config.credentials.trainerpassword);
    await review.goto_induction();
    await review.goto_task();
    await review.markTaskAsSatisfactory();
    await  logoff.logouttrainer();
});