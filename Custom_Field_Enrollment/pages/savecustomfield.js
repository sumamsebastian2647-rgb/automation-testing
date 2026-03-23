const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, '../data/customFields.json');

function saveCustomFields(formName, sectionKey, fields) {
  let data = {};

  if (fs.existsSync(FILE_PATH)) {
    data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8') || '{}');
  }

  if (!data[formName]) {
    data[formName] = {};
  }

  data[formName][sectionKey] = fields;

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

function loadCustomFields(formName) {
  if (!fs.existsSync(FILE_PATH)) return {};
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'))[formName] || {};
}

module.exports = {
  saveCustomFields,
  loadCustomFields
};
