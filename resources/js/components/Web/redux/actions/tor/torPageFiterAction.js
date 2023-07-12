import {
    SET_TOR_FILTER,
    IS_TOR_FILTER_IS_RESET
  } from '../../types/tor/torPageFilterType';
  import { addFlashMessage } from '../webActions';
  import axios from 'axios'
  
  export const isFilterIsReset = (isFilter, isReset) => (dispatch, getState) => {
    dispatch({
      type: IS_TOR_FILTER_IS_RESET,
      isFilter,
      isReset
      });
  
      return Promise.resolve(getState());
  };
  
  export const onChange = (name, value) => (dispatch, getState) => {
    dispatch({
      type: SET_TOR_FILTER,
      name,
      value
      });
  
      return Promise.resolve(getState());
  };
  
  
  export const resetFilter = () => (dispatch, getState) => {
    dispatch(onChange('search', ""));
    dispatch(isFilterIsReset(false, true));
    dispatch(onChange('contract_length', { min: 0, max: 24 }));
    dispatch(onChange('choosen_country', []));
    dispatch(onChange('choosen_language', []));
    dispatch(onChange('choosen_immap_office', []));
    dispatch(onChange('errors', {}));
  };
  
  
  export const getTorCountry = () => (dispatch, getState) => {
    return axios
      .get('/api/jobs/countries')
      .then((res) => {
        if (res.status == 200) {
          dispatch(onChange('countries', res.data.data));
          return true;
        }
      })
      .catch((err) => {
        dispatch(
          addFlashMessage({
            type: 'error',
            text: 'There is an error get data country'
          })
        );
      });
  };
  
  const localeCompare = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };
   
  export const filterArray = (name, value) => (dispatch, getState) => {
    let jobFilter = getState().jobFilter;
    let stateName = jobFilter[name];
    let arrIndex = stateName.indexOf(value);
  
    if (arrIndex >= 0) {
      stateName.splice(arrIndex, 1);
    } else {
      stateName.push(value);
    }
    dispatch(isFilterIsReset(true, false));
    return dispatch(onChange(name, stateName));
  }
  
  