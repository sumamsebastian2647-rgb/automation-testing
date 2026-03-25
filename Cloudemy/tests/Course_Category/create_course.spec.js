// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { Pagecoursecategory } = require('../../pages/Pagecoursecategory');
const path = require('path');
const config = require('../../config/config');


test.describe.serial('Course Management -Course Category Tests', () => {
  let dashboardPage;
  let dashboardPage1;
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    dashboardPage = new DashboardPage(page);
    dashboardPage1= new Pagecoursecategory(page);
    await dashboardPage1.navigateToCourseCategory();
    await page.waitForURL(/course-categories\/index/, { timeout: 15000 });
    await page.waitForSelector('table tbody', { state: 'visible', timeout: 15000 });
  });
  //Create new course category
  test('Active dashboard - Create Category @category @smoke', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName = `${config.courseCategory.baseName}_${timestamp}`;
    console.log('Creating active category:', categoryName);
    await page.waitForSelector('a[href*="/course-categories/create"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.openCreateForm();
    await page.waitForSelector('#coursecategories-cat_name', { state: 'visible', timeout: 10000 });
    await dashboardPage1.createCourseCategory(categoryName);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="CourseCategoriesSearch[cat_name]"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.searchCourseCategory(categoryName);
    await expect(page.locator('table tr', { hasText: categoryName })).toBeVisible({ timeout: 10000 });
    console.log('✅ Created new active course category successfully');
  });
  //Create new course category with empty field
  test('Active dashboard - Validate empty form error UI @category  @regression', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName1 = `${config.courseCategory.baseName}_${timestamp}`;
    await page.waitForSelector('a[href*="/course-categories/create"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.openCreateForm();
    await page.waitForSelector('#coursecategories-cat_name', { state: 'visible', timeout: 10000 });
    await dashboardPage1.submitEmptyForm();
    const errorSummary = page.locator('.error-summary');
    await expect(errorSummary).toBeVisible({ timeout: 10000 });
    await expect(
      errorSummary.locator('li', { hasText: 'Category Name cannot be blank.' })
    ).toBeVisible({ timeout: 10000 });
    console.log('⚠️ Validation error displayed as expected');
    await page.locator('#coursecategories-cat_name').clear();
    await page.fill('#coursecategories-cat_name', categoryName1);
    const saveBtn = page.locator('div.box-footer button.btn.btn-success.btn-flat');
    await expect(saveBtn).toBeEnabled({ timeout: 10000 });
    await saveBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="CourseCategoriesSearch[cat_name]"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.searchCourseCategory(categoryName1);
    await expect(page.locator('table tr', { hasText: categoryName1 })).toBeVisible({ timeout: 10000 });
    console.log('✅ Verified category UI creation after validation');
  });
  //Verify duplicate category name error
  test('Active dashboard - Duplicate Course Category name check @category @regression', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName2 = `${config.courseCategory.baseName}_${timestamp}`;
    await page.waitForSelector('a[href*="/course-categories/create"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.openCreateForm();
    await page.waitForSelector('#coursecategories-cat_name', { state: 'visible', timeout: 10000 });
    await page.locator('#coursecategories-cat_name').clear();
    await page.fill('#coursecategories-cat_name', config.courseCategory.duplicate);
    const saveBtn = page.locator('div.box-footer button.btn.btn-success.btn-flat');
    await expect(saveBtn).toBeEnabled({ timeout: 10000 });
    await dashboardPage1.submitEmptyForm();
    const errorToast = page.locator('.alert.alert-danger[role="alert"]');
    await expect(errorToast).toBeVisible({ timeout: 15000 });
    await expect(errorToast).toContainText('Course category already exist.');
    console.log('⚠️ Duplicate category error displayed as expected');
    await page.locator('#coursecategories-cat_name').clear();
    await page.fill('#coursecategories-cat_name', categoryName2);
    await expect(saveBtn).toBeEnabled({ timeout: 10000 });
    await saveBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="CourseCategoriesSearch[cat_name]"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.searchCourseCategory(categoryName2);
    await expect(page.locator('table tr', { hasText: categoryName2 })).toBeVisible({ timeout: 10000 });
    console.log('✅ Verified duplicate and new category creation successfully');
  });
  //Create course category from inactive dashboard
  test('Inactive dashboard - Create new Course Category @category  @regression', async ({ page }) => {
       await page.waitForSelector(
      'a.btn.btn-warning.btn-flat.pull-right.margin-right-one',
      { state: 'visible', timeout: 10000 }
    );
    await dashboardPage1.clickShowInactiveCategories();
    await page.waitForSelector('.kv-grid-table', { state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const categoryName = `${config.courseCategory.baseName}_INACTIVE_${timestamp}`;
    console.log('Creating category in inactive dashboard:', categoryName);
    await page.waitForSelector('a[href*="/course-categories/create"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.openCreateForm();
    await page.waitForSelector('#coursecategories-cat_name', { state: 'visible', timeout: 10000 });
    await dashboardPage1.createCourseCategory(categoryName);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="CourseCategoriesSearch[cat_name]"]', { state: 'visible', timeout: 10000 });
    await dashboardPage1.searchCourseCategory(categoryName);
    await expect(page.locator('table tr', { hasText: categoryName })).toBeVisible({ timeout: 10000 });
    console.log('✅ Created course category successfully from inactive dashboard view');
  });
});