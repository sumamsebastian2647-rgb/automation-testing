// config.js

// ---- Helper: Short unique ID (YYMMDD + random 2 digits) ----
const generateShortId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 8).replace(/-/g, ''); // YYMMDD
  const rand = Math.floor(Math.random() * 90) + 10; // 10–99
  return `${datePart}${rand}`; // e.g., 25101047
};

// ---- Helper: Generate compact unique credentials ----
const generateUserCredentials = (role = 'User') => {
  const initials = role
    .split(' ')
    .map(word => word[0].toLowerCase())
    .join('');
  const id = generateShortId();

  return {
    firstName: `${initials}fn${id}`,   // e.g., trfn25101047
    lastName: `${initials}ln${id}`,    // e.g., trln25101047
    username: `${initials}usr${id}`,   // e.g., trusr25101047
    email: `${initials}${id}@mailinator.com`, // e.g., tr25101047@mailinator.com
  };
};

// ---- Main Config ----
module.exports = {
  credentials: {
    baseURL: 'https://rto2503.cloudemy.au/site/login',
    username: 'Rto2503',
    password: 'Rto@2024$',
    student_username: 'navamy123',
    student_password: 'bXqE5fyf',
  },

  defaultPassword: 'Admin@123',

  personalInfo: {
    dob:'04-12-1990',
    phoneNumber: '0412131212',
    course: 'Course_Sample_01',
    photo: 'profile.png'
  },

  addressInfo: {
    building: 'wewe',
    unit: 'www',
    street: 'ww',
    pobox: 'www',
    address: '123 Main Street',
    city: 'Sydney',
    postcode: '4000',
    state: 'Queensland (QLD)',
    country: 'Australia',
  },

  messages: {
    successMessage: 'Admin created successfully',
  },

  generateShortId,
  generateUserCredentials,
};
