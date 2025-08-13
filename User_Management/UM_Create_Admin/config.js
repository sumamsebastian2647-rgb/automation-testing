// config.js

// Helper: Generate an ultra-short unique ID
const generateUltraShortId = () => {
  const now = new Date();
  // YYMMDD + HHmm (10 digits total)
  const formatted = now.toISOString().replace(/[-:T.]/g, '').slice(2, 12);
  const random = Math.floor(Math.random() * 900) + 100; // 100–999 (3 digits)
  return `${random}${formatted}`;
};

// Helper: Generate username/email/name with compact prefixes
const generateUserCredentials = (role) => {
  // Take only initials from role words, e.g., "Sales Manager" → "SM"
  const initials = role
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
  const uniqueId = generateUltraShortId();

  return {
    firstName: `TU_${initials}_${uniqueId}`,    // e.g., TU_SM_48225080712
    lastName: `Auto`,
    username: `tu_${initials}_${uniqueId}`,
    email: `tu_${uniqueId}@maininator.com`,
  };
};

module.exports = {
  credentials: {
    baseURL: 'https://rto2503.cloudemy.au/site/login',
    username: 'Rto2503',
    password: 'Rto@2024$',
    student_username: 'navamy123',
    student_password: 'bXqE5fyf',
  },

  jobRoles: [
    'Course Admin',
    'Student Manager',
    'RTO Manager',
    'Sales Manager',
  ],

  defaultPassword: 'Admin@123',

  personalInfo: {
    phoneNumber: '0412131212',
  },

  addressInfo: {
    address: '123 Main Street',
    city: 'Sydney',
    postcode: '4000',
    state: 'Queensland (QLD)',
    country: 'Australia',
  },

  messages: {
    successMessage: 'Admin created successfully',
  },

  generateUltraShortId,
  generateUserCredentials,
};
