# Test Cases Documentation

This document outlines the test cases identified from the project's test suite, including core functionalities and potential edge cases.

## Core Cases

*   **Login**:
    *   Successful login with valid credentials.
*   **Course Induction Management**:
    *   Navigate to Course Induction list.
    *   Open a specific course induction.
    *   Create a new course induction.
    *   Link an induction to a course.
*   **Task Management**:
    *   Create a new task with valid details (title, description, added fields).
    *   Add text and number fields to a task.
    *   Navigate to a specific task ("Not Started" or "In Progress").
    *   Fill task form fields (text and number).
    *   Submit a task successfully.
    *   Confirm task submission.
*   **Logout**:
    *   Successful logout.

## Edge Cases

*   **Login**:
    *   Login with invalid username.
    *   Login with invalid password.
    *   Login with empty username.
    *   Login with empty password.
*   **Course Induction Management**:
    *   Attempt to open a course induction that does not exist.
    *   Attempt to create a course induction with a name that already exists.
*   **Task Management**:
    *   Create a task with a missing title.
    *   Create a task with a missing description.
    *   Attempt to add fields to a task when no field types are available or the UI is not as expected.
    *   Enter invalid data into task form fields (e.g., non-numeric in a number field).
    *   Attempt to save a task without filling all required fields.
    *   Network errors during task creation or saving.
    *   Attempt to create a task with a duplicate name (if not handled by unique naming).
    *   Navigate to a task that is already submitted or in a different status.
    *   Task form fields are not present or have different types than expected.
    *   Submission confirmation modal not appearing or having different text.
    *   Network errors during task submission.
*   Attempt to submit an already submitted task.

## Low Priority Cases

*   Verify that the task submission confirmation message is displayed correctly.
*   Verify that the task form fields are correctly displayed with their respective types (text, number).

## High Priority Cases

*   Test task submission with valid data in all fields.
*   Test task submission with invalid data in number fields.
*   **Logout**:
    *   User profile image not found during logout attempt.
    *   Sign out link not found during logout attempt.
    *   Attempt to log out when already logged out.
