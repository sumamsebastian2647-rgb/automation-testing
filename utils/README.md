# Utils Directory

Shared utility functions used across all enrollment types.

## Files to migrate:

### Common utilities:
- Copy `auth.js` from any enrollment folder (they should be similar)
- Copy `fetchOtpFromMailinator.js` from Existing_enrollment
- Copy `dataManager.js` if needed

## Usage:
Import shared utilities like:
```javascript
const { loginAsAdmin, logoutAsAdmin } = require('../../utils/auth');
const { fetchOtpWithRetry } = require('../../utils/fetchOtpFromMailinator');
```
