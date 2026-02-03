module.exports = {
  credentials: {
    // Base origin (changes per environment). Override when running:
    // PowerShell:  $env:CM_BASE_ORIGIN="https://prod.example.com"
    // CMD:         set CM_BASE_ORIGIN=https://prod.example.com
    baseOrigin: process.env.CM_BASE_ORIGIN || 'https://rto2503.cloudemy.au',

    // Login URL derived from baseOrigin
    baseURL: `${process.env.CM_BASE_ORIGIN || 'https://rto2503.cloudemy.au'}/site/login`,
   // username: 'Rto2503',
   // password: 'Rto@2024$',
     username: 'sherry',
     password: '1234',
  },
   courseData: {
    courseCode: "CRS10013",
    courseName: "Automation Course13",
    avetmissCode: "AV100",
    avetmissName: "Sample AVETMISS Name13",
    coursecode_with_space:"CRS1001 ",
     price: "1000",
    overview: "Sample course instruction",
    rplInstruction: "fgSample RPL instructionfgfgf",
    image: "horticulture.jpeg",
    nominalHours: "50",
    trainerSearch: "kerstin Tony"
  },
 
};
 