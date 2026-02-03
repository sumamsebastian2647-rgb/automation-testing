# Feature Documentation: Course Forum Topic Creation & Notification

## Overview
This feature automates the end-to-end **Course Forum workflow**, validating that when a trainer creates a forum topic, the corresponding student receives a notification.

It covers multi-role interaction, ensuring both **content creation** and **notification delivery** function correctly.

---

## Actors
- **Trainer / Staff User**: Creates a forum topic
- **Student User**: Receives notification

---

## Preconditions
- Application is accessible
- Valid trainer and student credentials exist
- Course forum feature is enabled
- Target course exists in the system

---

## Feature Flow

### Trainer Actions
1. Login to the application
2. Navigate to Course Forum
3. Search for a course
4. Create a new forum topic
5. Logout from the system

### Student Actions
6. Login to the application
7. Check notifications
8. Verify forum topic notification is received

---

## Test Data
The feature uses centralized configuration data for:
- Trainer credentials
- Student credentials
- Course name
- Topic title
- Topic description

---

## Validations
- Trainer can create a forum topic successfully
- Topic creation triggers a notification
- Student receives and views the notification
- Role-based access works correctly

---

## Outcome
- Ensures forum functionality is working as expected
- Confirms notification mechanism reliability
- Prevents regression in course communication features
