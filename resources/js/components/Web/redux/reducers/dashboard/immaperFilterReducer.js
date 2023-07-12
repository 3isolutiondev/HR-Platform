import {
    SET_IMMAPERS_FILTER,
    SET_BULK_IMMAPERS_FILTER,
    RESET_IMMAPERS_FILTER,
    IS_IMMAPERS_FILTER_IS_RESET
  } from '../../types/dashboard/immaperFilterType'
  
  const initialState = {
    search: '',
    contract_expire_date: '',
    duty_station: [],
    immap_office: [],
    line_manager: [],
    status_contract: [],
    project_code: [],
    errors: {},
    isReset: false,
    isFilter: false,
  };
  
  export default (state = initialState, action = {}) => {
    switch (action.type) {
      case SET_IMMAPERS_FILTER:
        return {
          ...state,
          [action.name]: action.value
        };
      case IS_IMMAPERS_FILTER_IS_RESET:
        return {
          ...state,
          isFilter: action.isFilter,
          isReset: action.isReset
        };
      case SET_BULK_IMMAPERS_FILTER:
        let jobsData = { ...state };
        Object.keys(jobsData).map((key) => {
          if (action.bulkData.hasOwnProperty(key)) {
            jobsData[key] = action.bulkData[key];
          }
        });
  
        return jobsData;
      case RESET_IMMAPERS_FILTER:
        return initialState;
      default:
        return state;
    }
  };
  