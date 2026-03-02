# Verification Modules

This directory contains modular, reusable verification functions for student enrollment verification in Playwright test automation.

## Directory Structure

```
verification/
├── index.js                      # Exports all verification functions
├── utils.js                      # Shared utilities (retry, search, confirm, etc.)
├── verifyManualPaid.js          # Manual paid student verification
├── verifyManualUnpaid.js        # Manual unpaid student verification
├── verifyAutoPaid.js            # Auto paid student verification
└── verifyAutoUnpaid.js          # Auto unpaid student verification
```

## Verification Types

### Manual Paid
Students who require manual enrollment confirmation and have already paid.

**Workflow:**
1. Navigate to Pending Enrolment → New Students
2. Confirm enrollment
3. Verify in Active Students

### Manual Unpaid
Students who require manual enrollment confirmation and need payment processing.

**Workflow:**
1. Navigate to Pending Enrolment → New Students
2. Confirm enrollment
3. Navigate to Unpaid Students → New Students
4. Mark as paid
5. Verify in Active Students

### Auto Paid
Students who are automatically enrolled and have already paid.

**Workflow:**
1. Directly verify in Active Students (no manual steps needed)

### Auto Unpaid
Students who are automatically enrolled but need payment processing.

**Workflow:**
1. Navigate to Unpaid Students → New Students
2. Mark as paid
3. Verify in Active Students

## Import Patterns

### Bulk Import (from index)

Import multiple verification functions at once:

```javascript
const {
  verify_manualpaidnewstudent,
  verify_manualunpaidnewstudent,
  verify_autopaidnewstudent,
  verify_autounpaidnewstudent
} = require('../verification');

// Use in tests
await verify_manualpaidnewstudent(page, courseName);
await verify_manualunpaidnewstudent(page, courseName);
```

### Individual Module Import (Recommended)

Import specific verification functions from their individual modules:

```javascript
const { verify_manualpaidnewstudent } = require('../verification/verifyManualPaid');
const { verify_manualunpaidnewstudent } = require('../verification/verifyManualUnpaid');
const { verify_autopaidnewstudent } = require('../verification/verifyAutoPaid');
const { verify_autounpaidnewstudent } = require('../verification/verifyAutoUnpaid');

// Use in tests
await verify_manualpaidnewstudent(page, courseName);
```

### Utilities Import

Import utility functions when creating custom verification workflows:

```javascript
const {
  retry,
  getPageElements,
  searchAndVerifyStudent,
  confirmEnrollment,
  markAsPaid,
  verifyInActiveStudents
} = require('../verification/utils');

// Use in custom workflows
const elements = getPageElements(page);
await confirmEnrollment(page, elements, studentName);
await verifyInActiveStudents(page, elements, studentName, courseName);
```

## Usage Examples

### Example 1: Basic Verification in Tests

```javascript
const { test } = require('@playwright/test');
const { loginAsAdmin, logoutAsAdmin } = require('../auth');
const {
  verify_manualpaidnewstudent,
  verify_manualunpaidnewstudent,
  verify_autopaidnewstudent,
  verify_autounpaidnewstudent
} = require('../verification');

test('Verify manual paid student enrollment', async ({ page }) => {
  await loginAsAdmin(page);
  await verify_manualpaidnewstudent(page, 'Course Name');
  await logoutAsAdmin(page);
});

test('Verify manual unpaid student enrollment', async ({ page }) => {
  await loginAsAdmin(page);
  await verify_manualunpaidnewstudent(page, 'Course Name');
  await logoutAsAdmin(page);
});

test('Verify auto paid student enrollment', async ({ page }) => {
  await loginAsAdmin(page);
  await verify_autopaidnewstudent(page, 'Course Name');
  await logoutAsAdmin(page);
});

test('Verify auto unpaid student enrollment', async ({ page }) => {
  await loginAsAdmin(page);
  await verify_autounpaidnewstudent(page, 'Course Name');
  await logoutAsAdmin(page);
});
```

### Example 2: Using Different Personal Data

Each verification function uses specific config data:

```javascript
// Manual Paid uses config.personal1
await verify_manualpaidnewstudent(page, 'Course Name');

// Manual Unpaid uses config.personal2
await verify_manualunpaidnewstudent(page, 'Course Name');

// Auto Paid uses config.personal3
await verify_autopaidnewstudent(page, 'Course Name');

// Auto Unpaid uses config.personal4
await verify_autounpaidnewstudent(page, 'Course Name');

// Temporary Manual Paid uses config.personal5
const { verify_manualpaidnewstudent_temporary } = require('../verification/verifyManualPaid');
await verify_manualpaidnewstudent_temporary(page, 'Course Name');
```

### Example 3: Custom Verification Workflow

Create custom verification workflows using utility functions:

```javascript
const {
  retry,
  getPageElements,
  confirmEnrollment,
  markAsPaid,
  verifyInActiveStudents
} = require('../verification/utils');

async function customVerification(page, studentName, courseName) {
  const elements = getPageElements(page);
  
  // Navigate to student management
  await retry(() => elements.studentManagementLink.click());
  
  // Custom workflow steps
  await elements.pendingEnrolmentLink.click();
  await confirmEnrollment(page, elements, studentName);
  
  // Verify in active students
  await verifyInActiveStudents(page, elements, studentName, courseName);
}
```

### Example 4: Error Handling

All verification functions include built-in error handling and logging:

```javascript
const { verify_manualpaidnewstudent } = require('../verification/verifyManualPaid');

try {
  await verify_manualpaidnewstudent(page, 'Course Name');
  console.log('Verification successful');
} catch (error) {
  console.error('Verification failed:', error.message);
  // Screenshots are automatically taken on errors
  // Check for files like: search-error-{timestamp}.png
}
```

## Utility Functions

### retry(fn, maxAttempts, delay)
Retries a function multiple times with delay between attempts.

```javascript
await retry(async () => {
  await elements.activeStudentsLink.click();
}, 3, 1000);
```

### searchAndVerifyStudent(page, elements, studentName)
Searches for a student with pagination support.

```javascript
const found = await searchAndVerifyStudent(page, elements, 'John Doe');
if (found) {
  console.log('Student found');
}
```

### confirmEnrollment(page, elements, studentName)
Confirms enrollment for a pending student.

```javascript
await confirmEnrollment(page, elements, 'John Doe');
```

### markAsPaid(page, elements, studentName)
Marks an unpaid student as paid.

```javascript
await markAsPaid(page, elements, 'John Doe');
```

### verifyInActiveStudents(page, elements, studentName, course)
Verifies student appears in active students list for a specific course.

```javascript
await verifyInActiveStudents(page, elements, 'John Doe', 'Course Name');
```

### getPageElements(page)
Returns an object with all page element locators.

```javascript
const elements = getPageElements(page);
await elements.studentManagementLink.click();
await elements.pendingEnrolmentLink.click();
```

## Configuration

All verification modules depend on the `config.js` file in the project root. Ensure your config file contains personal data for all verification types:

```javascript
// config.js
module.exports = {
  config: {
    personal1: { firstName: 'John', lastName: 'Doe', /* ... */ },  // Manual Paid
    personal2: { firstName: 'Jane', lastName: 'Smith', /* ... */ }, // Manual Unpaid
    personal3: { firstName: 'Bob', lastName: 'Johnson', /* ... */ }, // Auto Paid
    personal4: { firstName: 'Alice', lastName: 'Williams', /* ... */ }, // Auto Unpaid
    personal5: { firstName: 'Test', lastName: 'User', /* ... */ }  // Temporary
  }
};
```

## Migration from Old Structure

If you're migrating from the monolithic `verify_enrollment.js` file:

### Before:
```javascript
const { verify_manualpaidnewstudent } = require('../verify_enrollment.js');
```

### After (Option 1 - Bulk Import):
```javascript
const { verify_manualpaidnewstudent } = require('../verification');
```

### After (Option 2 - Individual Imports):
```javascript
const { verify_manualpaidnewstudent } = require('../verification/verifyManualPaid');
```

Both options work identically. Individual imports are recommended for better code organization.

## Debugging

All verification functions include automatic debugging features:

- **Console Logging**: Detailed logs at each step
- **Screenshots**: Automatic screenshots on errors (saved as `{error-type}-{timestamp}.png`)
- **Input State Debugging**: Logs input field states when searches fail
- **Retry Logic**: Automatic retries for flaky operations

## Benefits

- **Modularity**: Each verification type is in its own file
- **Reusability**: Import only the verification types you need
- **Maintainability**: Changes to one type don't affect others
- **Testability**: Individual modules can be tested in isolation
- **Documentation**: Each module has JSDoc comments with usage examples
- **Error Handling**: Built-in retry logic and error screenshots
- **Flexibility**: Mix and match verification types for different test scenarios

## Contributing

When adding new verification types:

1. Create a new file in the `verification/` directory
2. Follow the existing naming convention (`verify{Type}.js`)
3. Add JSDoc comments with parameter and return type documentation
4. Export functions as named exports (not default exports)
5. Import utilities from `./utils` and config from `../config`
6. Add the new verification to `verification/index.js` for bulk import support
7. Update this README with the new verification type information
