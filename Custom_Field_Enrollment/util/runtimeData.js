const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../runtime/generatedUrls.json');

function saveGeneratedUrl(formName, url) {
  // Ensure folder exists
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let data = {};

  // Safe read
  if (fs.existsSync(FILE_PATH)) {
    const content = fs.readFileSync(FILE_PATH, 'utf-8').trim();
    if (content) {
      data = JSON.parse(content);
    }
  }

  // Save / update
  data[formName] = url;

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}


function getLatestGeneratedUrl() {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error('No generatedUrls.json found. Run generate link test first.');
  }

  const raw = fs.readFileSync(FILE_PATH, 'utf-8').trim();
  if (!raw) {
    throw new Error('generatedUrls.json is empty');
  }

  const data = JSON.parse(raw);
  const urls = Object.values(data);

  if (!urls.length) {
    throw new Error('No URLs found in generatedUrls.json');
  }

  return urls[urls.length - 1]; // ✅ latest
}


module.exports = {
  saveGeneratedUrl,
  getLatestGeneratedUrl
};
