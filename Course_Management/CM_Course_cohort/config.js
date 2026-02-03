module.exports = {
  credentials: {
    baseURL: 'https://rto2503.cloudemy.au/site/login',
    username: 'Rto2503',
    password: 'Rto@2024$',
  },
   // Trainers
    trainers: {
        defaultTrainer: 'Kerstin Tony',
        anotherTrainer: 'Ali Kadri'
    },

    // Courses
    courses: {
        carbonFarming: 'AHCSS00085 - Carbon Farming',
        healthDiploma: '52868WA - Diploma of Health and Wellness'
    },
      // Cohort defaults (other fields can be overridden in test)
    cohorts: {
        default: {
            location: 'Australia',
            startDate: '2025-11-20',
            endDate: '2026-12-20',
            name:'sample'
        }
    },

    // Timeouts
    timeouts: {
        default: 5000,
        long: 15000
    }
 
};
