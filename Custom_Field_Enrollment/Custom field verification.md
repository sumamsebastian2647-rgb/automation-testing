Custom field verification

# Markdown content for the feature documentation
content = """# Feature Documentation: Automated Enrollment & Student Verification

## Overview
This test suite automates the process of:

1. Creating and editing course forms in the admin dashboard.
2. Generating enrollment links for courses.
3. Enrolling students with multiple payment and acceptance scenarios.
4. Verifying student enrollment, including custom field data.
5. Handling edge cases like already enrolled students.
6. Logging and error reporting, including screenshots on failures.

The suite integrates **modular Playwright helpers** for form filling, custom field validation, document uploads, and payment verification.

---

## Features

### 1. Dashboard Automation

**Purpose**:  
Manage and configure courses in the admin dashboard, including creating and editing forms.

**Workflow**:
1. Login as Admin.
2. Navigate to the Dashboard.
3. Open specific course form templates.
4. Fill form information and save layout.
5. Add custom fields to form sections dynamically.

**Outcome**:
- Forms created or updated.
- Custom fields prepared for automated enrollment testing.

---

### 2. Course Link Generation

**Purpose**:  
Generate enrollment links for students to use.

**Workflow**:
1. Search for a form by name.
2. Generate enrollment link from the first row.
3. Save the generated link for use in student enrollment tests.
4. Verify the link contains a valid URL.

**Outcome**:
- Enrollment link is saved and ready for automated student enrollment.
- Admin can optionally test the link by navigating to it.

---

### 3. Student Enrollment

**Purpose**:  
Automate student enrollment using multiple acceptance and payment scenarios.

**Scenarios Supported**:
- Manual acceptance – payment done.
- Manual acceptance – payment pending.
- Auto acceptance – payment done.
- Auto acceptance – payment pending.

**Workflow**:
1. Navigate to generated enrollment link.
2. Fill personal, residential, contact, employer, and pre-course evaluation details.
3. Handle Recognition of Prior Learning (RPL) and student identifiers.
4. Upload required documents.
5. Fill declaration and signature section.
6. Complete payment using appropriate function (`completePayment_paid` or `_unpaid`).
7. Admin logs in to verify enrollment.

**Outcome**:
- Student is enrolled according to the scenario.
- Enrollment data ready for verification in Active Students.

---

### 4. Student Verification

**Purpose**:  
Ensure enrolled students have correct data in the system.

**Workflow**:
1. Search student using global search.
2. Fallback to flexible search if standard search fails.
3. Verify custom field data and specific sections.
4. Execute scenario-specific verification (`verify_manualpaidnewstudent`, etc.).
5. Logout Admin after verification.

**Edge Cases**:
- Already enrolled student detected via modal; test stops gracefully.
- Custom field verification failure aborts scenario but logs errors.

**Outcome**:
- Confirms student enrollment.
- Verifies custom fields for completeness.
- Logs errors and captures screenshots for debugging.
"""

