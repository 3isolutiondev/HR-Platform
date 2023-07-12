import { SET_ROSTER_STEPS, SET_ROSTER_DATA } from '../../types/roster/roster';

const initialState = {
  roster_steps: [],
  selected_step: {},
  tabValue: 0,
  profileData: {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 1,
    last_page: 1,
    last_page_url: '',
    next_page_url: '',
    path: '',
    per_page: 5,
    prev_page_url: '',
    to: 1,
    total: 1
  },
  errors: {},
  roster_processes: [],
  roster_process: '',
  campaign_is_open: "no",
  campaign_open_at_quarter: "",
  campaign_open_at_year: "",
  campaignLoading: false,
  selected_profiles: [],
  check_all: false,
  openReferenceCheckResult: false,
  reference_check_modal_id: '',
  reference_check_profile_id: '',
  reference_already_did: [],
  openIMTestResult: false,
  im_test_modal_id: '',
  im_test_profile_id: '',
  im_test_done: [],
  isLoading: false,
  selected_page: 1,
  showAllRejected: false,
  profiles_selected: []
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ROSTER_STEPS:
      return {
        ...state,
        roster_steps: action.roster_steps
      };
    case SET_ROSTER_DATA:
      return {
        ...state,
        [action.name]: action.value
      };
    default:
      return state;
  }
};
