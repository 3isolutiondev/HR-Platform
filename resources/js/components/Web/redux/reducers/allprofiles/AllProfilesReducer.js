import {
  SET_COMPLETED_PROFILE_DATA
} from '../../types/allprofiles/allProfilesTypes';

const initialState = {
  profiles: [],
  isLoading: false,
  openProfile: false,
  selected_profile_id: '',
  selected_profile_ids: [],
  // invitation data
  job_openings: [],
  roster_process: [],

  // archive information feature
  openInfo: false,
  jobRecruitmentProcess: [],
  rosterRecruitmentProcess: [],
  surgeAlertRecruitmentProcess: [],
  archiveLoading: false,
  archiveUserId: 0,

  // filter data
  search: '',
  searchTemp: '',
  chosen_language: [],
  chosen_degree_level: [],
  chosen_sector: [],
  chosen_skill: [],
  chosen_field_of_work: [],
  chosen_country: [],
  chosen_nationality: [],
  chosen_country_of_residence: '',
  is_available: [],
  gender_filter: [
    { value: 'male', label: 'Male' }, 
    { value: 'female', label: 'Female' }, 
    { value: 'do_not_want_specify', label:'Do not want to specify' }, 
    { value: 'other', label: 'Other' }
  ],
  immaper_filter: [{ value: 'is_immaper', label: 'iMMAPer' }, { value: 'not_immaper', label: 'Not iMMAPer' }],
  available_filter: [
    { value: 'available', label: 'Available' },
    { value: 'not_available', label: 'Not Available' }
  ],
  search_language: '',
  search_sector: '',
  search_skill: '',
  search_degree_level: '',
  search_field_of_work: '',
  search_country: '',
  search_nationality: '',
  experience: 0,
  immaper_status: [],
  select_gender: [],
  languageDialog: false,
  sectorDialog: false,
  skillDialog: false,
  degreeLevelDialog: false,
  fieldOfWorkDialog: false,
  countryDialog: false,
  nationalityDialog: false,
  languageParameters: {
    id: '',
    language_level: {
      value: '',
      label: ''
    },
    is_mother_tongue: 0
  },
  sectorParameters: {
    id: '',
    years: 1
  },
  skillParameters: {
    id: '',
    years: 1,
    rating: 1
  },
  degreeLevelParameters: {
    id: '',
    degree: '',
    study: ''
  },
  fieldOfWorkParameters: {
    id: ''
  },
  nationalityParameters: {
    id: ''
  },
  countryParameters: {
    id: '',
    years: 1
  },
  errors: {},

  nationality_lists: [],
  language_lists: [],
  degree_level_lists: [],
  sector_lists: [],
  field_of_work_lists: [],
  country_lists: [],
  country_of_residence_lists: [],
  skill_lists: []
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_COMPLETED_PROFILE_DATA:
      return {
        ...state,
        [action.name]: action.value
      };
    default:
      return state;
  }
};
