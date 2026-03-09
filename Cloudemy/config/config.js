const path = require('path');
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
    image1: 'cimage.jpg',
    folder: 'files'
  },
  // Create Competency form test data
  createCompetencyData: {
    // Validation-safe unique code: letters/numbers/hyphen/underscore only (max 20)
    getUniqueCompetencyCode: () => `CMP-${Date.now().toString().slice(-10)}`,
    // Unique competency name (max 180)
    getUniqueCompetencyName: () => `Automation Competency ${Date.now()} ${Math.floor(Math.random() * 1000)}`,
    folder: 'files',
    learningMaterial: 'LM01.pdf',
    scormMaterial: 'Employ_Health_SCORM.zip',
    folder: 'files',
    nominalhr:'40',
    scheduledhr:'60',
    DeliveryProviderABN:'11111111111',
    WorkplaceABN:'22222222222',
    StudentContributionAmount:'112',
    StudentContributionAmountOther:'1123',
    EmployerContributionAmount:'322',
    fundingSourceState: '00P',
    deliveryModeAVETMISS: ['I', 'W'],
    predominantDeliveryMode: 'I',

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
  },
   assessment: {
    questionTitles: {
      essay: 'Explain the importance of workplace safety procedures.',
      form: 'Describe the steps involved in effective customer communication.',
      audio: 'Record your explanation about handling workplace conflict.',
      video: 'Provide a video explanation of customer service best practices.'
    },
    modelAnswers: {
      essay: `Workplace safety procedures are essential to ensure a safe and healthy working environment.
They help prevent accidents, injuries, and health hazards.
Following safety protocols improves productivity and ensures compliance with workplace regulations.`
    },
    file: {
      sampleFile: path.join(__dirname, '../files/test.pdf')
    },
  },
  testData: {
    questions: {
      multipleChoice: {
        question: "Explain multiple choice question?",
        correctFeedback: "Correct answer selected",
        wrongFeedback: "Wrong answer selected",
        answer: "Option 1",
        options1: "Option 1",
        option2: "Option 2"
      },

      shortAnswer: {
        question: "Explain short answer question?",
        correctFeedback: "Correct short answer",
        wrongFeedback: "Incorrect short answer",
        answer: "Short Answer Example"
      },

      fillInBlank: {
        question: "Fill in the blank question ____",
        correctFeedback: "Correct fill",
        wrongFeedback: "Wrong fill",
        answer: "Blank Answer"
      },

      smartFillInBlank: {
        question: "Smart fill in the blank ____",
        correctFeedback: "Correct smart fill",
        wrongFeedback: "Wrong smart fill",
        answer: "Smart Answer"
      },

      trueFalse: {
        question: "True or False Question?",
        correctFeedback: "Correct True/False",
        wrongFeedback: "Wrong True/False",
        answer: "True"
      },

      matching: {
        question: "Match the following",
        correctFeedback: "Correct matching",
        wrongFeedback: "Wrong matching",
        answer: "Item A - Option A"
      },

      dragAndDrop: {
        question: "Drag and Drop Question",
        correctFeedback: "Correct drag",
        wrongFeedback: "Wrong drag",
        answer: "Drag Item"
      }
    }
  }

};
 