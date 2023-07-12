import {
  SET_NATIONALITIES,
  SET_YEARS,
  SET_LANGUAGES,
  SET_COUNTRIES,
  SET_P11_COUNTRIES,
  SET_SECTORS,
  SET_UN_ORGANIZATION,
  SET_SKILLS_FOR_MATCHING,
  SET_REQUIREMENT_OPTIONS,
  SET_DEGREE_LEVELS,
  SET_COUNTRY_CODE_WITH_FLAG,
  SET_LANGUAGE_LEVELS,
  SET_FIELD_OF_WORKS,
  SET_ROLES,
  SET_IMMAP_OFFICES,
  SET_P11_IMMAP_OFFICES,
  SET_JOB_CATEGORIES,
  SET_IM_TEST_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_JOB_STATUS,
  SET_TIMEZONES,
  SET_ROSTER_PROCESS,
  SET_SKYPE,
  SET_REFERENCE_CHECK,
  SET_IMMAPERS,
  SET_EMAIL_ADDRESS,
  SET_IMMAP_EMAIL_ADDRESS,
  SET_HQ_OFFICE,
  SET_SECURITY_MODULE_COUNTRIES,
  SET_SECURITY_MODULE_PURPOSES,
  SET_SECURITY_MODULE_MOVEMENTS,
  SET_SECURITY_MODULE_MOVEMENT_STATES,
  SET_SECURITY_MODULE_SECURITY_MEASURES,
  SET_LINE_MANAGERS,
  SET_THIRD_PARTY_PERMISSIONS
} from '../types/optionTypes';

const initialState = {
  years: [],
  nationalities: [],
  countries: [],
  p11Countries: [],
  languages: [],
  language_levels: [],
  un_organizations: [],
  skillsForMatching: [],
  requirementOptions: [],
  degree_levels: [],
  countryCodeWithFlag: [],
  approvedFieldOfWorks: [],
  approvedSectors: [],
  roles: [],
  p11ImmapOffices: [],
  immapOffices: [],
  jobCategories: [],
  im_test_templates: [],
  quiz_templates: [],
  job_status: [],
  timezones: [],
  roster_processes: [],
  skype: '',
  reference_checks: [],
  immapers: [],
  email: [],
  immap_emails: [],
  hqOffices: [],
  security_module_countries: [],
  security_module_purposes: [],
  security_module_movements: [],
  security_module_movement_states: [],
  security_module_security_measures: [],
  lineManagers: [],
  third_party_permissions: []
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SKILLS_FOR_MATCHING:
      return {
        ...state,
        skillsForMatching: action.data
      };
    case SET_YEARS:
      return {
        ...state,
        years: action.years
      };
    case SET_LANGUAGES:
      return {
        ...state,
        languages: action.data
      };
    case SET_COUNTRIES:
      return {
        ...state,
        countries: action.data
      };
    case SET_P11_COUNTRIES:
      return {
        ...state,
        p11Countries: action.data
      };
    case SET_NATIONALITIES:
      return {
        ...state,
        nationalities: action.data
      };
    case SET_SECTORS:
      return {
        ...state,
        approvedSectors: action.data
      };
    case SET_UN_ORGANIZATION:
      return {
        ...state,
        un_organizations: action.data
      };
    case SET_REQUIREMENT_OPTIONS:
      return {
        requirementOptions: action.data
      };
    case SET_DEGREE_LEVELS:
      return {
        ...state,
        degree_levels: action.data
      };
    case SET_LANGUAGE_LEVELS:
      return {
        ...state,
        language_levels: action.data
      };
    case SET_COUNTRY_CODE_WITH_FLAG:
      return {
        ...state,
        countryCodeWithFlag: action.data
      };
    case SET_FIELD_OF_WORKS:
      return {
        ...state,
        approvedFieldOfWorks: action.data
      };
    case SET_ROLES:
      return {
        ...state,
        roles: action.data
      };
    case SET_IMMAP_OFFICES:
      return {
        ...state,
        immapOffices: action.data
      };
    case SET_P11_IMMAP_OFFICES:
      return {
        ...state,
        p11ImmapOffices: action.data
      };
    case SET_JOB_CATEGORIES:
      return {
        ...state,
        jobCategories: action.data
      };
    case SET_IM_TEST_TEMPLATES:
      return {
        ...state,
        im_test_templates: action.data
      };
    case SET_QUIZ_TEMPLATES:
      return {
        ...state,
        quiz_templates: action.data
      };
    case SET_JOB_STATUS:
      return {
        ...state,
        job_status: action.data
      };
    case SET_TIMEZONES:
      return {
        ...state,
        timezones: action.data
      };
    case SET_ROSTER_PROCESS:
      return {
        ...state,
        roster_processes: action.data
      };
    case SET_SKYPE:
      return {
        ...state,
        skype: action.data
      };
    case SET_REFERENCE_CHECK:
      return {
        ...state,
        reference_checks: action.data
      };
    case SET_IMMAPERS:
      return {
        ...state,
        immapers: action.data
      };
    case SET_EMAIL_ADDRESS:
      return {
        ...state,
        email: action.data
      };
    case SET_IMMAP_EMAIL_ADDRESS:
      return {
        ...state,
        immap_emails: action.data
      };
    case SET_HQ_OFFICE:
      return {
        ...state,
        hqOffices: action.data
      };
    case SET_SECURITY_MODULE_COUNTRIES:
      return {
        ...state,
        security_module_countries: action.data
      };
    case SET_SECURITY_MODULE_PURPOSES:
      return {
        ...state,
        security_module_purposes: action.data
      };
    case SET_SECURITY_MODULE_MOVEMENTS:
      return {
        ...state,
        security_module_movements: action.data
      };
    case SET_SECURITY_MODULE_MOVEMENT_STATES:
      return {
        ...state,
        security_module_movement_states: action.data
      };
    case SET_SECURITY_MODULE_SECURITY_MEASURES:
      return {
        ...state,
        security_module_security_measures: action.data
      };
    case SET_LINE_MANAGERS:
      return {
        ...state,
        lineManagers: action.data
      }
      case SET_THIRD_PARTY_PERMISSIONS:
        return {
          ...state,
          third_party_permissions: action.data
        }
    default:
      return state;
  }
}
