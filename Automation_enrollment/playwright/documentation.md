# Enrollment and Verification Process Documentation

This document describes the end-to-end process of enrolling new and existing students and verifying their enrollment in the admin panel.

## 1. Enrollment Process

The enrollment process involves the following steps:

1.  **Navigate to Enrollment Link:** Access the enrollment form using a generated enrollment link. The link can be configured for manual or auto acceptance.
2.  **Fill Personal Details:** Provide personal information such as title, first name, last name, date of birth, gender, phone number, email, and username.
3.  **Fill Residential Details:** Enter residential address information, including building name, unit number, street number, street name, suburb, state, and country.
4.  **Fill Contact Information:** Provide contact details such as home phone, work phone, emergency contact name, relationship, emergency contact number, and emergency contact email.
5.  **Fill Employer Details:** Enter employer information, including Australian Business Number (ABN), contact person name, contact person email, and contact person phone number.
6.  **Fill Pre-Course Evaluation:** Answer pre-course evaluation questions related to education and employment background.
7.  **RPL (Recognition of Prior Learning):** Provide information related to RPL.
8.  **Fill Student Identifiers:** Enter student identifiers such as Unique Student Identifier (USI), Learner Unique Identifier, WorkReady Participant Number, SACE Student ID, SafeworkSA ID, and Victorian Student Number.
9.  **Upload Documents:** Upload required documents such as Australian Drivers Licence (front and back), Concession Cards, Medicare Card, Photo, and any other relevant documents.
10. **Fill Declaration and Signature:** Sign the declaration and provide the name and date.
11. **Complete Payment:** Choose a payment option (Paid/Free or Pay Later) and submit the form.

### 1.1 Existing Student Enrollment

For existing students, the enrollment process includes an additional step:

1.  **OTP Verification:** Verify the email address by entering a 6-digit OTP received via email.

## 2. Verification Process

The verification process is performed in the admin panel and involves the following steps:

1.  **Login to Admin Panel:** Log in to the admin panel using admin credentials.
2.  **Navigate to Pending Enrolments:** Go to Student Management -> Pending Enrolment -> New Students (for new students) or Existing Students (for existing students).
3.  **Search for Student:** Search for the student using their name or student ID.
4.  **Confirm Enrollment:** Confirm the enrollment for the pending student.
5.  **Navigate to Active Students:** Go to Student Management -> Active Students.
6.  **Search for Course:** Search for the course using the course code or name.
7.  **Search for Student in Course:** Search for the student within the course using their name.
8.  **Verify Enrollment:** Verify that the student is listed as an active student in the course.

### 2.1 Unpaid Student Verification

For unpaid students, the verification process includes additional steps:

1.  **Navigate to Unpaid Students:** Go to Student Management -> Unpaid Students -> New Students (for new students) or Existing Students (for existing students).
2.  **Search for Student:** Search for the student using their name or student ID.
3.  **Mark as Paid:** Mark the unpaid student as paid.

## 3. Test Cases

The following test cases are covered:

*   New Student - Manual Acceptance - Payment Paid
*   New Student - Manual Acceptance - Payment Unpaid
*   New Student - Auto Acceptance - Payment Paid
*   New Student - Auto Acceptance - Payment Unpaid
*   Existing Student - Manual Acceptance - Payment Paid
*   Existing Student - Manual Acceptance - Payment Unpaid
*   Existing Student - Auto Acceptance - Payment Paid
*   Existing Student - Auto Acceptance - Payment Unpaid

## 4. Files

The following files are involved in the enrollment and verification process:

*   `enrollment_steps.js`: Contains functions for filling out the enrollment form.
*   `newenrollment.spec.js`: Contains test cases for enrolling new students.
*   `existingstudent.spec.js`: Contains test cases for enrolling existing students.
*   `verify_enrollment.js`: Contains functions for verifying the enrollment of new students.
*   `verify_enrollment_existing.js`: Contains functions for verifying the enrollment of existing students.
*   `config.js`: Contains configuration data such as personal details, residential details, and course information.
*   `fetchOtpFromMailinator.js`: Contains functions for fetching OTP from Mailinator for existing student verification.
*   `generatelink.js`: Contains functions for generating enrollment links.
*   `auth.js`: Contains functions for logging in and logging out of the admin panel.
*   `start_new.spec.js`: Contains a test case for enrolling a temporary student who starts and resumes the enrollment process.
