const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../data/customFields.json');

function getCustomFields(formName, section) {
  if (!fs.existsSync(FILE)) return [];
  const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  return data?.[formName]?.[section] || [];
}

module.exports = { getCustomFields };
