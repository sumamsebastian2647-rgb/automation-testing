const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'generatedData.json');

// Read all student data blocks
function readAllStudentData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return {};
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return fileContent ? JSON.parse(fileContent) : {};
  } catch (error) {
    console.error('Failed to read JSON file:', error);
    return {};
  }
}

// Save student data for a specific key (e.g., personal1, personal2)
function saveStudentData(key, data) {
  const allData = readAllStudentData();
  allData[key] = { ...data };
  fs.writeFileSync(dataFilePath, JSON.stringify(allData, null, 2));
}

// Get student data for a specific key
function getStudentData(key) {
  const allData = readAllStudentData();
  return allData[key];
}

// Save student data with metadata (like test description)
function saveStudentDataWithMeta(key, data, description) {
  const allData = readAllStudentData();
  allData[key] = {
    ...data,
    description, // e.g., 'verify_manualpaidnewstudent'
    savedAt: new Date().toISOString(),
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(allData, null, 2));
}

// Fetch by description (optional utility)
function getStudentByDescription(desc) {
  const allData = readAllStudentData();
  return Object.values(allData).find((block) => block.description === desc);
}

module.exports = {
  saveStudentData,
  getStudentData,
  readAllStudentData,
  saveStudentDataWithMeta,
  getStudentByDescription,
};
