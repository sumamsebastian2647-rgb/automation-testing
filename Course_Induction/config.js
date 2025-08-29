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
    firstName: `TU_${initials}_${uniqueId}`,
    lastName: `Auto`,
    username: `tu_${initials}_${uniqueId}`,
    email: `tu_${uniqueId}@maininator.com`,
  };
};
// Helper: Generate unique task name
const generateTaskName = () => {
  return `Task_${generateUltraShortId()}`;
};
// Helper: Generate unique course induction name
const generateInductionName = () => {
  return `CourseInduction_${generateUltraShortId()}`;
};

module.exports = {
  credentials: {
    baseURL: 'https://rto2503.cloudemy.au/site/login',
    username: 'Rto2503',
    password: 'Rto@2024$',
    student_username: 'navamy123',
    student_password: 'bXqE5fyf',
    trainerusername:'kerstin0524',
    trainerpassword:'Rto@2024$',
  },

  courseInduction: {
    name: generateInductionName(),
  },

  messages: {
    successMessage: 'Induction created successfully',
  },
  task: {
    name: generateTaskName(),
  },
  course:{
    name: 'Advanced Diploma of Screen and Media',

  },
  student:{
    name:'Navamy',
  },

  generateUltraShortId,
  generateUserCredentials,
  generateInductionName,
};
