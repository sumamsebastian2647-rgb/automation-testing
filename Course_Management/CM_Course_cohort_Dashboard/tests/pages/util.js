function generateRandomCode(prefix = "CRS") {
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit unique
  return `${prefix}${random}`;
}

function generateRandomName(prefix = "Course") {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix} ${random}`;
}

module.exports = { generateRandomCode, generateRandomName };

