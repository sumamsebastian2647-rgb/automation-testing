/**
 * Verification Index
 * 
 * This module provides a convenient single entry point for importing all verification functions.
 * You can import all verifications from here, or import individual verifications from their specific modules.
 * 
 * @module verification
 * 
 * @example
 * // Bulk import from index
 * const { 
 *   verify_manualpaidnewstudent, 
 *   verify_manualunpaidnewstudent 
 * } = require('../verification');
 * 
 * @example
 * // Individual module import (recommended for better tree-shaking)
 * const { verify_manualpaidnewstudent } = require('../verification/verifyManualPaid');
 * const { verify_manualunpaidnewstudent } = require('../verification/verifyManualUnpaid');
 */

// Manual Paid
const {
  verify_manualpaidnewstudent,
  verify_manualpaidnewstudent_temporary
} = require('./verifyManualPaid');

// Manual Unpaid
const {
  verify_manualunpaidnewstudent
} = require('./verifyManualUnpaid');

// Auto Paid
const {
  verify_autopaidnewstudent
} = require('./verifyAutoPaid');

// Auto Unpaid
const {
  verify_autounpaidnewstudent
} = require('./verifyAutoUnpaid');

module.exports = {
  // Manual Paid
  verify_manualpaidnewstudent,
  verify_manualpaidnewstudent_temporary,
  
  // Manual Unpaid
  verify_manualunpaidnewstudent,
  
  // Auto Paid
  verify_autopaidnewstudent,
  
  // Auto Unpaid
  verify_autounpaidnewstudent
};
