import {
    SET_IMMAPERS_FILTER,
    IS_IMMAPERS_FILTER_IS_RESET
  } from '../../types/dashboard/immaperFilterType';
  
  export const isFilterIsReset = (isFilter, isReset) => (dispatch, getState) => {
    dispatch({
      type: IS_IMMAPERS_FILTER_IS_RESET,
      isFilter,
      isReset
      });
  
      return Promise.resolve(getState());
  };
  
  export const onChange = (name, value) => (dispatch, getState) => {
    dispatch({
      type: SET_IMMAPERS_FILTER,
      name,
      value
      });
  
      return Promise.resolve(getState());
  };
  
  
  export const resetFilter = () => (dispatch, getState) => {
    dispatch(onChange('search', ""));
    dispatch(onChange('contract_expire_date', ""));
    dispatch(isFilterIsReset(false, true));
    dispatch(onChange('duty_station', []));
    dispatch(onChange('immap_office', []));
    dispatch(onChange('line_manager', []));
    dispatch(onChange('status_contract', []));
    dispatch(onChange('project_code', []));
    dispatch(onChange('errors', {}));
  };
  
   
  export const filterArray = (name, value) => (dispatch, getState) => {
   
    let immaperFilter = getState().immaperFilter;
    let stateName = immaperFilter[name];
    let arrIndex = stateName.indexOf(value);
  
    if (arrIndex >= 0) {
      stateName.splice(arrIndex, 1);
    } else {
      stateName.push(value);
    }
    dispatch(isFilterIsReset(true, false));
    return dispatch(onChange(name, stateName));
  }
  
  