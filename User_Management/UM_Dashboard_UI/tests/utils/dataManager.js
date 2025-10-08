const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/generatedAdmins.json');

function writeData(role, data) {
  let existingData = {};

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      if (fileContents.trim()) {
        existingData = JSON.parse(fileContents);
      }
    }
  } catch (err) {
    console.error('Error reading existing JSON:', err);
  }

  existingData[role] = data;

  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  } catch (err) {
    console.error('Error writing to JSON:', err);
  }
}

module.exports = { writeData };
