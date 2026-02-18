module.exports = {
  credentials: {
    baseURL: 'https://rto2503.cloudemy.au/site/login',
    username: 'Rto2503',
    password: 'Rto@2024$',
  },
  // Create Course form test data
  createCourseData: {
    // Validation-safe unique code (<=10 chars for AVETMISS code field)
    getUniqueCourseCode: () => `CR${Date.now().toString().slice(-8)}`,
    // Unique course name to avoid "Name cannot be blank" and duplicate-name issues
    getUniqueCourseName: () => `Automation Course ${Date.now()} ${Math.floor(Math.random() * 1000)}`,
    duration: '2 year',
    price: '2000',
    defaultTrainerName: 'Kerstin Tony',
    imagePath: 'tests/fixtures/course-image.png',
  },
 // Test data used in course search test
  searchData: {
    category: '18',                // General Knowledge Course
    code: '00085',
    courseName: 'carbon',
    type: '3',                     // Accredited Course
    price: '1000'
  },

  // Courses you click in results
  courseResults: {
    generalKnowledge: 'General Knowledge Course',
    carbonFarming: 'AHCSS00085 - Carbon Farming',
    diplomaLifeCoaching: 'General Knowledge Course 10883NAT - Diploma of Life Coaching',
    certificateIV: 'CHC42912 - Certificate IV in'
  }
  
};
 