// Created by Sumam Sebastian on 04/11/2025
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const config = require('../config');

test.describe('Course Management - Cohort Search Filters', () => {
  let dashboardPage;

  // --- Login before each test ---
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      config.credentials.username,
      config.credentials.password
    );

    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToCourseCohort();
  });

  // 🔍 1. Search Student
  test('Search cohort by student name', async ({ page }) => {
    await dashboardPage.searchStudent(config.studentSearch.name);
  });

  // 👨‍🏫 2. Search Trainer
  test('Search cohort by trainer', async ({ page }) => {
    await dashboardPage.selectTrainer(config.trainerSearch.name);
     console.log('found trainer name');
  });

  // 📚 3. Search by Course
  test('Search cohort by course filters', async ({ page }) => {
    await dashboardPage.searchCourse(
          
      config.courseSearch.carbonCourse
    );
  });

  // 🏷️ 4. Search by Cohort Name
  test('Search cohort by cohort name', async ({ page }) => {
    await dashboardPage.searchCohortByName(config.cohortSearch.name);
  });

  // 📍 5. Search by Location
  test('Search cohort by location', async ({ page }) => {
    await dashboardPage.searchCohortByLocation(config.cohortSearch.location);
  });
});
