# Feature Documentation: Dashboard Validation & Student URL Collection

## Overview
This test suite validates two major capabilities of the application:
1. Dashboard feature validation for authenticated users
2. Student URL collection through manual navigation

It combines automated checks with controlled manual exploration to support regression testing, exploratory testing, and navigation coverage analysis.

---

## Feature 1: Dashboard Feature Tests

### Purpose
To ensure the Dashboard loads correctly after login and that key navigation elements function as expected.

### Preconditions
- Application is accessible
- Valid staff/admin credentials are configured
- User has dashboard access

### Workflow
- User logs in using configured credentials
- Dashboard modal (if present) is closed
- Dashboard page visit is logged
- Top menu navigation is verified
- Additional dashboard flows (courses, widgets, certificates, logout) can be enabled as needed

### Error Handling & Reporting
- Toast messages captured on failure (if available)
- Screenshots taken automatically on test failure
- Page visits logged for reporting
- Consolidated HTML report generated after test execution

### Outcome
- Confirms dashboard accessibility
- Validates navigation stability
- Provides evidence for failures through screenshots and logs

---

## Feature 2: Student URL Collector – Manual Navigation

### Purpose
To capture all URLs visited by a student user during manual navigation for analysis and coverage tracking.

### Preconditions
- Valid student credentials exist
- Tester is available to perform manual navigation during execution

### Workflow
1. Student logs into the application
2. URL collection session starts
3. Tester manually navigates through the application (up to 15 minutes)
4. All visited URLs are recorded with title, path, and timestamp
5. URL collection stops and data is saved
6. Summary and screenshots are generated

### Data Collected
- Page title
- Full URL
- URL pathname
- Timestamp

### Outcome
- Produces a real navigation map
- Helps identify uncovered or redundant routes
- Supports regression and exploratory testing

---

## Feature 3: Load Previously Collected URLs

### Purpose
To review URLs collected from previous sessions without repeating manual navigation.

### Workflow
- Load stored URL data from file
- Display URL details and timestamps
- Show summary statistics (total URLs and unique paths)

### Outcome
- Enables historical navigation analysis
- Reduces repeated exploratory effort

---

## Key Benefits
- Combines automation with exploratory testing
- Improves navigation coverage
- Supports regression planning
- Generates reusable artifacts for QA and UAT
