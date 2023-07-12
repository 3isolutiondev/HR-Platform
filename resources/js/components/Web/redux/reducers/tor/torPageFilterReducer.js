import {
    SET_TOR_FILTER,
    SET_BULK_TOR_FILTER,
    RESET_TOR_FILTER,
    IS_TOR_FILTER_IS_RESET
  } from '../../types/tor/torPageFilterType';
  
  const initialState = {
    search: '',
    contract_length: { min: 0, max: 24 },
    choosen_country: [],
    countries: [],
    choosen_language: [],
    choosen_immap_office: [],
    languages: [],
    errors: {},
    isReset: false,
    isFilter: false,
  };
  
  export default (state = initialState, action = {}) => {
    switch (action.type) {
      case SET_TOR_FILTER:
        return {
          ...state,
          [action.name]: action.value
        };
      case IS_TOR_FILTER_IS_RESET:
        return {
          ...state,
          isFilter: action.isFilter,
          isReset: action.isReset
        };
      case SET_BULK_TOR_FILTER:
        let jobsData = { ...state };
        Object.keys(jobsData).map((key) => {
          if (action.bulkData.hasOwnProperty(key)) {
            jobsData[key] = action.bulkData[key];
          }
        });
  
        return jobsData;
      case RESET_TOR_FILTER:
        return initialState;
      default:
        return state;
    }
  };
  