// config.js

const generateUsers = (count = 5) => {
  const users = {};
  const baseTimestamp = Date.now().toString().slice(-5); // short unique suffix

  for (let i = 1; i <= count; i++) {
    const suffix = i.toString().padStart(2, '0');
    const uniqueTag = `${suffix}_${baseTimestamp}`;
    const username = `userAT${uniqueTag}`;
    const email = `${username}@mailinator.com`;

    users[`personal${i}`] = {
      title: 'Mrs',
      firstName: username,
      lastName: 'Test',
      dob: '04-12-1994',
      gender: 'Female',
      phone: '0000000000',
      email,
      username,
    };
  }

  return users;
};

const config = {
//production credentials
 /* credentials: {
    baseUrl: 'https://rto2503.cloudemy.app/site/login',
    username: 'rto2503',
    password: 'Rto@2024$',
  },*/
   credentials: {
    baseUrl: 'https://rto2503.cloudemy.au/site/login',
    username: 'rto2503',
    password: 'Rto@2024$',
  },
  courses: {
    first: /Veterinary Nursing/i,
    second: /Business/i,
  },
  timeouts: {
    short: 500,
    medium: 1000,
    long: 10000,
  },
  user: {
    name: 'Ali Kadri',
  },
  ...generateUsers(5),
  residential: {
    building: 'Sampleflat',
    unit: 'flat',
    streetNo: '123',
    streetName: 'test street',
    poBox: '124',
    suburb: 'syd',
    suburbSelect: 'Sydney/1021/NSW',
    state: 'New South Wales (NSW)',
    country: 'Australia',
  },
  contact: {
    homePhone: '0000000000000',
    workPhone: '000000000000000000',
    emergencyName: 'Sample1',
    relationship: 'Self',
    emergencyPhone: '1111111111',
    emergencyEmail: 'testemergency@gmail.com',
  },
  employer: {
    abn: '40382360375',
    contactName: 'testcontact',
    contactEmail: 'testcontact@gmail.com',
    contactPhone: '222222222',
  },
  //production courselist &link
/*  courselist: {
    course1: 'Course in Retrofitting for Energy and Water Efficiency',
    course2: 'Certificate IV in Training and Assessment',
    course3: 'Certificate IV in Dance',
    course4: 'Aqua Exercise Instruction',
  },
  generatelink: {
    manualacceptancelink1: 'https://rto2503.cloudemy.app/forms?u=a9fa7f1f',
    manualacceptancelink2: 'https://rto2503.cloudemy.app/forms?u=4575b40b',
    autoacceptancelink1: 'https://rto2503.cloudemy.app/forms?u=7dd4e9c5',
    autoacceptancelink2: 'https://rto2503.cloudemy.app/forms?u=e3604361',
  },*/
  //Staging courselist & links
  courselist: {
    course1: 'Certificate II in Computer Assembly and Repair',
    course2: 'Certificate I in Conservation and Ecosystem Management',
    course3: 'Certificate III in Sports Turf Management',
    course4: 'Aviation Operator Skill Set2024',
  },
  generatelink: {
    manualacceptancelink1: 'https://rto2503.cloudemy.au/forms?u=5a76e2d9',
    manualacceptancelink2: 'https://rto2503.cloudemy.au/forms?u=64ff2bd0',
    autoacceptancelink1: 'https://rto2503.cloudemy.au/forms?u=abc55588',
    autoacceptancelink2: 'https://rto2503.cloudemy.au/forms?u=1b36df89',
  },
  preCourseEval: {
    countryOfBirth: 'Australia',
    cityOfBirth: 'testcity',
    citizenshipCountry: 'Australia',
    citizenshipStatus: 'Australian Citizen',
    employmentStatus: '02',
    occupation: 'Accommodation and Hospitality Managers (141000)',
    industry: 'Accommodation (44)',
    language: 'Aboriginal English, so',
    englishProficiency: '2',
    englishSupport: 'Y',
    attendingSchool: '1',
    highestSchoolLevel: '11',
    schoolYear: '2006',
    schoolName: 'testschool',
    disabilityDetail: 'test test',
    supportCategory: '08',
  },
  identifiers: {
    usi: '1111111111',
    lui: '1111111111',
    wrpn: '111111111',
    sace: '1111111',
    safework: '11111111111111',
    vsn: '1111111',
  },
  documents: {
    driversFront: 'test1.pdf',
    driversBack: 'test2.pdf',
    concessionCard: 'health.jpg',
    medicare: 'test4.pdf',
    photo: 'photo.png',
    other: 'test.pdf',
  },
  declaration: {
    signerName: 'Test Automation',
    signDate: '3',
  },
  payment: {
    mode: 'In person',
    paymentDate: '3',
  },
};

module.exports = { config };
