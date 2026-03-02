/**
 * International-specific enrollment steps
 * These steps are ONLY used for international student enrollments
 * 
 * For common steps (personal details, residential, contact, etc.),
 * use: require('../common/shared-steps.js')
 */

const { fillVisaAndArrivalInfo } = require('./fillVisaAndArrivalInfo');
const { fillEnglishProficiency } = require('./fillEnglishProficiency');
const { fillPreviousStudies } = require('./fillPreviousStudies');
const { fillEmploymentHistory } = require('./fillEmploymentHistory');
const { fillFinancialDeclaration } = require('./fillFinancialDeclaration');
const { fillAgentRepresentative } = require('./fillAgentRepresentative');
const { fillEmployerDetails } = require('./fillEmployerDetails');
const { fillPreCourseEvaluation } = require('./fillPreCourseEvaluation');

module.exports = {
  fillPreCourseEvaluation,
  fillVisaAndArrivalInfo,
  fillEnglishProficiency,
  fillPreviousStudies,
  fillEmploymentHistory,
  fillFinancialDeclaration,
  fillAgentRepresentative,
  fillEmployerDetails
};
