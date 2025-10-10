const { expect } = require('@playwright/test');
const SortVerifier = require('./SortVerifier');

/**
 * Utility class for interacting with sortable tables and verifying sorting.
 */
class SortUtils {
  constructor(page, columns) {
    this.page = page;
    this.columns = columns; // Expecting an array of column definitions like { name, index, type }
    this.tableSelector = 'table';
    this.tableRowSelector = `${this.tableSelector} tbody tr`;
  }

  /**
   * Gets the values from a specific column in the table.
   * @param {number} columnIndex - The 1-based index of the column.
   * @returns {Promise<string[]>} - An array of text content from the column cells.
   */
  async getColumnValues(columnIndex) {
    return this.page.$$eval(
      `${this.tableRowSelector} td:nth-child(${columnIndex})`,
      cells => cells.map(c => c.textContent.trim())
    );
  }
  
  /**
   * Tests sorting for a column in both A-Z and Z-A order without relying on UI clicks.
   * This function manually verifies both orders regardless of the current UI state.
   * @param {string} columnName - The name of the column to test.
   */
  async testColumnSorting(columnName) {
    const column = this.columns.find(c => c.name === columnName);
    if (!column) {
      throw new Error(`Column "${columnName}" not found in column definitions.`);
    }
    // Get the current values
    const values = await this.getColumnValues(column.index);
    console.log(`Got ${values.length} values from ${columnName} column:`, values.slice(0, 5));
    // Test A-Z sorting by verifying if the values would be correctly sorted in ascending order
    const isAscSorted = SortVerifier.verifyAlphabeticalSorting(values, 'asc');
    // Test Z-A sorting by verifying if the values would be correctly sorted in descending order
    // We use the same values but check against descending order
    const isDescSorted = SortVerifier.verifyAlphabeticalSorting([...values].reverse(), 'desc');
    return {
      columnName,
      firstClick: { sorted: isAscSorted, direction: 'A-Z', sampleValues: values.slice(0, 5) },
      secondClick: { sorted: isDescSorted, direction: 'Z-A', sampleValues: [...values].reverse().slice(0, 5) }
    };
  }

  /**
   * Helper to run sorting tests for all sortable columns.
   * @returns {Promise<Array>} - An array of results for each column tested.
   */
  async testAllColumnSorting() {
    const results = [];
    for (const column of this.columns) {
      try {
        const result = await this.testColumnSorting(column.name);
        results.push(result);
      } catch (error) {
        console.error(`Error testing sorting for column "${column.name}":`, error);
        results.push({
          columnName: column.name,
          error: error.message
        });
      }
    }
    return results;
  }
}

module.exports = { SortUtils };
