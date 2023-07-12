import {
  SET_JOB_FILTER,
  SET_BULK_JOB_FILTER,
  RESET_JOB_FILTER,
  IS_FILTER_IS_RESET
} from '../../types/jobs/jobsFilterTypes';

const initialState = {
  search: '',
  contract_length: { min: 0, max: 24 },
  choosen_country: [],
  countries: [],
  choosen_language: [],
  choosen_immap_office: [],
  languages: [],
  job_status: [],
  errors: {},
  isReset: false,
  isFilter: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_JOB_FILTER:
      return {
        ...state,
        [action.name]: action.value
      };
    case IS_FILTER_IS_RESET:
      return {
        ...state,
        isFilter: action.isFilter,
        isReset: action.isReset
      };
    case SET_BULK_JOB_FILTER:
      let jobsData = { ...state };
      Object.keys(jobsData).map((key) => {
        if (action.bulkData.hasOwnProperty(key)) {
          jobsData[key] = action.bulkData[key];
        }
      });

      return jobsData;
    case RESET_JOB_FILTER:
      return initialState;
    default:
      return state;
  }
};
