// utils/dataManager.js
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'courseinductionData.json');

function readJson() {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function writeJson(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readCourseName() {
  return readJson().courseInductionName || null;
}

function saveCourseName(courseInductionName) {
  const data = readJson();
  data.courseInductionName = courseInductionName;
  writeJson(data);
}

function saveTaskName(taskName) {
  const data = readJson();
  data.taskName = taskName;
  writeJson(data);
}

function readTaskName() {
  return readJson().taskName || null;
}

module.exports = { 
  saveCourseName, 
  readCourseName, 
  saveTaskName, 
  readTaskName 
};
