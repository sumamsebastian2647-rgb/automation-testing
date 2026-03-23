 """# Course Management Automation – Feature Documentation

This document explains the **marked modules and test specifications** inside the `COURSE_MANAGEMENT` automation repository.  
Each folder represents a **functional feature area**, and each `*.spec.js` file represents **Playwright test coverage** for that feature.

---

## 1. CM_Course_Category

### Purpose
Automates **Course Category management** features used by admins to organize courses.

### Covered Features
- Create course categories
- Activate / deactivate categories
- Sort category list
- Pagination handling
- View category dashboard data
- Update category details

### Test Files
| File | Feature Covered |
|----|----|
| `create_course.spec.js` | Create a new course category |
| `inactivate.spec.js` | Activate / deactivate category |
| `pagination.spec.js` | Pagination behavior validation |
| `sorting.spec.js` | Sorting by column headers |
| `view_dashboard.spec.js` | View category dashboard |
| `update_dashboard.spec.js` | Update existing category |

---

## 2. CM_Course_cohort

### Purpose
Handles **Course Cohort creation and management**.

### Covered Features
- Create cohort
- Update cohort
- View cohort details

### Test Files
| File | Feature Covered |
|----|----|
| `create.spec.js` | Create new course cohort |
| `update.spec.js` | Update cohort details |
| `view.spec.js` | View cohort information |

---

## 3. CM_Course_cohort_Dashboard

### Purpose
Validates **Cohort Dashboard UI and behavior**.

### Covered Features
- Cohort dashboard visibility
- Action buttons
- Pagination
- Dashboard cohort listing

### Test Files
| File | Feature Covered |
|----|----|
| `button.spec.js` | Button visibility & actions |
| `cohort.spec.js` | Cohort listing & data validation |
| `pagination.spec.js` | Pagination in dashboard |

---

## 4. CM_Course_List_Dashboard

### Purpose
Tests **Course List Dashboard** used to manage and monitor courses.

### Covered Features
- Course search
- Pagination
- View dashboard details
- Update dashboard data

### Test Files
| File | Feature Covered |
|----|----|
| `pagination.spec.js` | Pagination behavior |
| `search.spec.js` | Search courses |
| `view_dashboard.spec.js` | View dashboard info |
| `update_dashboard.spec.js` | Update course details |

---

## Common Structure Used Across Modules

### `tests/pages`
- Page Object Model (POM)
- Contains reusable selectors and actions
- Keeps test specs clean and readable

### `playwright.config.js`
- Global Playwright configuration
- Timeout, browser, reporter settings

### `config.js`
- Environment-specific values
- Credentials, URLs, test data

### Reports & Artifacts
- `playwright-report/` → HTML reports
- `test-results/` → screenshots, traces

---

## Overall Coverage Summary

✔ Admin workflows  
✔ UI validations  
✔ Pagination & sorting  
✔ Dashboard behavior  
✔ Reusable page objects  
✔ Modular test structure  

---

## Intended Usage
- Regression testing
- Smoke testing
- CI/CD pipeline execution
- Manual verification support

---

**Author:** QA Automation  
**Framework:** Playwright + JavaScript  
"""