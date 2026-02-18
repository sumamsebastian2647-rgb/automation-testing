# Tests Covered (Today)

## tests/course/smoke/create-course.spec.js
- @smoke Create course successfully and verify in list
- @smoke Cannot create course without name
- @smoke Cannot create course without code
- @smoke Cannot create course with spaces in code

## tests/course/regression/create-course_regression.spec.js
- @regression create course and find it using search function
- @regression create course with all major fields populated
- @regression verify all Create Course tooltips appear
- @regression cannot create duplicate course with same code and name
- @regression verify max length for course code and course name fields

## tests/course/smoke/edit-course.spec.js
- @smoke edit first course successfully with basic update flow

## tests/course/regression/edit-course_regression.spec.js
- @regression cannot update course without name
- @regression cannot update course without code
- @regression cannot update course with spaces in code
- @regression verify max length constraints on edit course fields

## tests/course/smoke/clone-course.spec.js
- @smoke clone first course, verify copy suffix, save, and verify in list

## tests/course/regression/clone-course_regression.spec.js
- @regression remove copy from cloned code and name should prevent duplicate save
- @regression cloned course cannot save when code and name are blank

## tests/course/smoke/show-competencies.spec.js
- @smoke click first course Show Competencies button and verify popup/details open
- @smoke search in Show Competencies using competency search box
- @smoke open first competency and click first Learning Material item
- @smoke open first assessment View button and verify new page opens

## pages/DashboardPage.js (helpers added/updated)
- openFirstCourseForEditFromList
- saveUpdatedCourseAndVerifySuccessToast
- openFirstCourseForCloneFromList
- saveClonedCourseAndVerifySaved
- goToCourseListFromForm (fallback handling)
