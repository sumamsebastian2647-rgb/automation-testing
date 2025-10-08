/**
 * Utility class for verifying sorting functionality in tables
 */
class SortVerifier {
  /**
   * Verify if values are sorted correctly
   * @param {Array} values - The values to check
   * @param {string} direction - Sort direction ('asc' or 'desc')
   * @param {string} dataType - Type of data ('text', 'number', 'date')
   * @returns {boolean} - Whether values are sorted correctly
   */
  static verifySorted(values, direction, dataType = 'text') {
    // Handle edge cases
    if (this.isEdgeCase(values)) {
      return true;
    }
    
    const sorted = [...values];
    
    if (direction === 'asc') {
      if (dataType === 'text') {
        sorted.sort((a, b) => a.localeCompare(b));
      } else if (dataType === 'number') {
        sorted.sort((a, b) => this.parseNumeric(a) - this.parseNumeric(b));
      } else if (dataType === 'date') {
        sorted.sort((a, b) => new Date(a) - new Date(b));
      }
    } else {
      if (dataType === 'text') {
        sorted.sort((a, b) => b.localeCompare(a));
      } else if (dataType === 'number') {
        sorted.sort((a, b) => this.parseNumeric(b) - this.parseNumeric(a));
      } else if (dataType === 'date') {
        sorted.sort((a, b) => new Date(b) - new Date(a));
      }
    }
    
    // Compare values
    const isEqual = this.areArraysEqual(values, sorted);
    
    if (!isEqual) {
      console.log(`Sorting verification failed for ${dataType} in ${direction} direction`);
      console.log('Expected:', sorted.slice(0, 5));
      console.log('Actual:', values.slice(0, 5));
    }
    
    return isEqual;
  }

  /**
   * Parse a value that might be numeric with formatting
   */
  static parseNumeric(value) {
    if (typeof value === 'number') return value;
    // Handle strings that might have formatting like commas, currency symbols, etc.
    return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
  }

 /**
 * Verify alphabetical sorting (A-Z or Z-A)
 * @param {Array} values - The string values to check
 * @param {string} direction - Sort direction ('asc' for A-Z, 'desc' for Z-A)
 * @returns {boolean} - Whether values are sorted correctly alphabetically
 */
static verifyAlphabeticalSorting(values, direction) {
  console.log(`Verifying ${direction === 'asc' ? 'A-Z' : 'Z-A'} sorting`);
  
  // Handle edge cases
  if (this.isEdgeCase(values)) {
    return true;
  }
  
  // For A-Z verification, we check if the values are already sorted ascending
  if (direction === 'asc') {
    const sorted = [...values].sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
    const result = this.areArraysEqual(values, sorted);
    
    if (!result) {
      console.log('A-Z check failed. Expected:', sorted.slice(0, 5), 'Actual:', values.slice(0, 5));
    }
    
    return result;
  } 
  // For Z-A verification, we check if the values are sorted descending
  else {
    const sorted = [...values].sort((a, b) => b.localeCompare(a, undefined, {sensitivity: 'base'}));
    const result = this.areArraysEqual(values, sorted);
    
    if (!result) {
      console.log('Z-A check failed. Expected:', sorted.slice(0, 5), 'Actual:', values.slice(0, 5));
    }
    
    return result;
  }
}

  /**
   * Check for edge cases like empty arrays or identical values
   */
  static isEdgeCase(values) {
    if (!values || values.length === 0) {
      console.log('Warning: Empty values array detected');
      return true;
    }
    
    const allSame = values.every(v => v === values[0]);
    if (allSame) {
      console.log('Note: All values are identical');
      return true;
    }
    
    return false;
  }
  
  /**
   * Compare two arrays for equality
   */
  static areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    
    return true;
  }
  
  /**
   * Generate a detailed report for sorting verification
   */
  static generateSortReport(columnName, values, sortDirection, dataType, isSorted) {
    return {
      column: columnName,
      direction: sortDirection,
      sorted: isSorted,
      values: values.slice(0, 5), // Sample of first 5 values
      expectedOrder: this.getExpectedOrderSample(values, sortDirection, dataType)
    };
  }
  
  /**
   * Get a sample of the expected sorted order for comparison
   */
  static getExpectedOrderSample(values, direction, dataType) {
    const sorted = [...values];
    
    if (direction === 'asc') {
      if (dataType === 'text') {
        sorted.sort((a, b) => a.localeCompare(b));
      } else if (dataType === 'number') {
        sorted.sort((a, b) => this.parseNumeric(a) - this.parseNumeric(b));
      } else if (dataType === 'date') {
        sorted.sort((a, b) => new Date(a) - new Date(b));
      }
    } else {
      if (dataType === 'text') {
        sorted.sort((a, b) => b.localeCompare(a));
      } else if (dataType === 'number') {
        sorted.sort((a, b) => this.parseNumeric(b) - this.parseNumeric(a));
      } else if (dataType === 'date') {
        sorted.sort((a, b) => new Date(b) - new Date(a));
      }
    }
    
    return sorted.slice(0, 5); // Sample of first 5 expected values
  }
  
  /**
   * Get a diagnostic message if sorting fails
   */
  static getDiagnosticMessage(values, direction, dataType) {
    const actualValues = values.slice(0, 10); // First 10 values
    const expectedValues = this.getExpectedOrderSample(values, direction, dataType).slice(0, 10);
    
    return {
      message: `Sorting verification failed for ${dataType} in ${direction} order`,
      actual: actualValues,
      expected: expectedValues,
      firstDifference: this.findFirstDifferenceIndex(actualValues, expectedValues)
    };
  }
  
  /**
   * Find the first index where two arrays differ
   */
  static findFirstDifferenceIndex(arr1, arr2) {
    const minLength = Math.min(arr1.length, arr2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (arr1[i] !== arr2[i]) {
        return i;
      }
    }
    
    return -1;
  }
}

module.exports = SortVerifier;
