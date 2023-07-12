/** import redux for combining reducer data */
import { combineReducers } from 'redux';

/** import redux persist librarty */
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/** import reducer needed for the system */
import auth from './authReducer';
import web from './webReducer';
import p11 from './p11Reducer';
import options from './optionsReducer';
import dropzoneField from './formFields/dropzoneReducer';
import bio from './profile/bioReducers';
import language from './profile/languageReducers';
import educationUniversity from './profile/educationUniversityReducer';
import educationSchool from './profile/educationSchoolReducer';
import skill from './profile/skillReducer';
import employmentRecords from './profile/employmentRecordReducer';
import profesionalSocieties from './profile/profesionalSocietiesReducer';
import portofolio from './profile/portofolioReducer';
import publication from './profile/publicationsReducer';
import disabilities from './profile/disabilitiesReducer';
import dependent from './profile/dependentsReducer';
import legalPermanentResidenceStatus from './profile/legalPermanentResidenceStatusReducer';
import legalStep from './profile/legalStepReducer';
import relativeEmployed from './profile/relativeInUnReducer';
import submittedAplicationUn from './profile/previouslySubmittedAplicationUNReducer';
import permanentCivilServants from './profile/permanentCivilServantsReducers';
import references from './profile/referencesReducer';
import relevanFact from './profile/relevanFactReducer';
import alreadyImmaper from './profile/iMMAPerReducer';
import bioAddress from './profile/bioAddressReducer';
import cvAndSignature from './profile/cvAndSignatureReducer';
import dashboardUser from './dashboard/userReducer';
import dashboardImmaper from './dashboard/immaperReducer';
import immapersList from './dashboard/immapers/immapersListReducer';
import rosterProcess from './dashboard/roster/rosterProcessReducer';
import rosterDashboard from './dashboard/roster/rosterDashboardReducer';
import roster from './roster/rosterReducer';
import dashboardSector from './dashboard/sector/sectorReducer';
import dashboardImmapOffice from './dashboard/immap-office/immapOfficeReducer';
import dashboardIMTestTemplate from './dashboard/im-test-template/imTestTemplateReducer';
import dashboardQuizTemplate from './dashboard/quiz-template/quizTemplateReducer';
import immaperForm from './dashboard/immaperFormReducer';
import immaperFilter from './dashboard/immaperFilterReducer';
import phoneNumber from './profile/phoneNumberReducers';
import profileRosterProcess from './profile/rosterProcessReducer';
import filter from './hr/hrFilterReducer';
import applicant_lists from './jobs/applicantReducer';
import request_contract_user from './jobs/requestContractReducer';
import pdfViewer from './common/PDFViewerReducer';
import recommendations from './common/RecommendationReducer';
import torRecommendations from './tor/torRecommendationReducer';
import jobRecommendations from './jobs/jobRecommendationReducer';
import imtest from './imtest/imtestReducer';
import imTestUser from './imtest/imTestUserReducer';
import torFilter from './tor/torFilterReducer';
import torPageFilter from './tor/torPageFilterReducer';
import torForm from './tor/torFormReducer';
import jobRecommendationFilter from './jobs/jobRecommendationFilterReducer';
import jobFilter from './jobs/jobFilterReducer';
import allProfiles from './allprofiles/AllProfilesReducer';
import allProfilesFilter from './allprofiles/AllProfilesFilterReducer';
import tabFilterJob from './jobs/jobTabReducer';
import userFilterStatus from './completionstatus/userFilterReducer';
import immaperTARForm from './security-module/iMMAPerTARFormReducer';
import immaperMRFForm from './security-module/iMMAPerMRFFormReducer';
import security from './security-module/SecurityReducer';
import securityFilter from './security-module/SecurityFilterReducer';
import policy from './policy/policyReducer';
import deleteAccount from './profile/deleteAccountReducer';
import cookieConsent from './common/CookieConsentReducer';
import tabFilterTor from './tor/torTabReducer';
import myTeam from './profile/myTeamReducer';


/**
 * redux persist configuration for roster features
 * @ignore
 */
const rosterPersistConfig = {
  key: 'roster',
  storage,
  whitelist: ['roster_process', 'roster_steps', 'selected_step', 'tabValue', 'selected_page', 'showAllRejected']
}

/**
 * redux persist configuration for options features
 * @ignore
 */
const optionPersistConfig = {
  key: 'options',
  storage,
  whitelist: ['roster_processes']
}

/** export the combined reducer */
export default combineReducers({
  auth,
  web,
  p11,
  options: persistReducer(optionPersistConfig, options),
  dropzoneField,
  bio,
  language,
  educationUniversity,
  educationSchool,
  skill,
  employmentRecords,
  profesionalSocieties,
  portofolio,
  publication,
  disabilities,
  dependent,
  legalPermanentResidenceStatus,
  legalStep,
  relativeEmployed,
  submittedAplicationUn,
  permanentCivilServants,
  references,
  relevanFact,
  bioAddress,
  cvAndSignature,
  dashboardUser,
  dashboardImmaper,
  dashboardSector,
  dashboardImmapOffice,
  dashboardIMTestTemplate,
  dashboardQuizTemplate,
  rosterProcess,
  rosterDashboard,
  roster: persistReducer(rosterPersistConfig, roster),
  phoneNumber,
  profileRosterProcess,
  filter,
  applicant_lists,
  request_contract_user,
  pdfViewer,
  recommendations,
  torRecommendations,
  jobRecommendations,
  imtest,
  imTestUser,
  alreadyImmaper,
  immaperForm,
  immaperFilter,
  immapersList,
  torFilter,
  torPageFilter,
  jobRecommendationFilter,
  allProfiles,
  allProfilesFilter,
  torForm,
  jobFilter,
  tabFilterJob,
  userFilterStatus,
  immaperTARForm,
  immaperMRFForm,
  security,
  securityFilter,
  policy,
  deleteAccount,
  cookieConsent,
  tabFilterTor,
  myTeam
});
