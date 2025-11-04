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
  otherdocumentname:{
    testdocument:'testdocument',
    docfile1:'Trainers_csv.csv',
    docfile2:'water.jpeg',
  },
  trainerPD: {
    organisationName: 'test1',
    totalHours: 30,
    startDate: '01-10-2024',
    endDate: '01-10-2025',
    expiryDate: '01-10-2026',
    activityDetails: 'nil',
    evidenceFiles: 'profile.png'
  },
   addWork: {
    organisation: 'ABC Org',
    jobRole: 'QA',
    description: 'initial description'
  },
  updateWork: {
    organisation: 'XYZ Org',
    description: 'updated description'
  },
  
   qualification: {
    add: {
      name: 'Diploma in IT',
      year: '2015',
      institution: 'ABC Institute',
      expiryDate: '31',              // day from calendar
      comment: 'first qualification',
      evidenceFile: 'profile.png'
    },
    update: {
      name: 'Diploma in Computer Science',
      institution: 'DEF Institute',
      comment: 'updated entry',
      expiryDate: '31-10-2026'
      // no year update as per your steps
    },
    messages: {
      saveToast: 'Qualification has been saved successfully.',
      deleteToast: 'Qualification has been deleted successfully.'
    }
  },
  trainerMatrixData: {
    case1: {
      competency: 'test11111',
      equivalentCompetency: 'test',
      utm_utq_id: '35',
      utm_utwe_id: '38',
      comments: 'dfdfdfdfd',
    },
    case2: {
      competency: 'automation',
      equivalentCompetency: 'trainer',
      utm_utq_id: '40',
      utm_utwe_id: '42',
      comments: 'automation data',
    },
  },
   trainerUpdate: {
    email: 't251017@gmail.com',
    firstName: 'testtr_update',
    lastName: 'lname_update',
    dobDay: '6',
    gender: 'Male',
    mobile: '0412131213',
    building: 'wewess',
    unit: 'wwwsss',
    street: 'wws',
    pobox: 'wwws',
    city: 'bris',
    profilePhoto: 'water.jpeg',
  },
  generateShortId,
  generateUserCredentials,
};
