import { SECURITY_FILTER_ON_CHANGE, SECURITY_FILTER_RESET } from '../../types/security-module/securityFilterTypes'
import axios from 'axios'
import { addFlashMessage } from '../webActions'
import { onChange as paramOnChange } from './securityActions'
import isEmpty from '../../../validations/common/isEmpty'

// Update specific security filter data on reducer
export const onChange = (name, value) => {
  return {
    type: SECURITY_FILTER_ON_CHANGE,
    name,
    value
  }
}

// Reset security filter
export const resetFilter = () => (dispatch, getState) => {
  const { tab } = getState().security
  dispatch(paramOnChange('queryParams', '?tab=' + tab + '&archiveTypes[]=latest'))
  return dispatch({
    type: SECURITY_FILTER_RESET,
  })
}

// Get all critical movements data
export const getCriticalities = () => (dispatch) => {
  return axios.get('/api/security-module/critical-movements/all-options')
    .then(res => {
      return dispatch(onChange('allCriticalities', res.data.data))
    })
    .catch(err => {
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while getting criticality movement data'
      }))
    })
}

// Get all travel purposes data
export const getPurposes = () => (dispatch) => {
  return axios.get('/api/security-module/travel-purposes/all-options')
    .then(res => {
      return dispatch(onChange('allPurposes', res.data.data))
    })
    .catch(err => {
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while getting travel purpose data'
      }))
    })
}

// Update Filter for checkbox options
export const filterArray = (name, value) => (dispatch, getState) => {
  // get filter data
  let paramFilter = getState().securityFilter;

  // get filter from url
  let filterParams = getState().security.queryParams

  // parameter value that need to be checked
  let paramValue = '&' + name + '[]=' + value

  let stateName = paramFilter[name];
  let arrIndex = stateName.indexOf(value);

  if (arrIndex >= 0) {
    stateName = stateName.filter((data, index) => index !== arrIndex)
    if (filterParams.indexOf(paramValue) > -1) {
      filterParams = filterParams.replace(paramValue, '')
    }
  } else {
    stateName = [...stateName, value]
    filterParams = filterParams + paramValue
  }

  dispatch(paramOnChange('queryParams', filterParams))

  return dispatch(onChange(name, stateName));
}

// Travel Dashboard -  Update Filter Travel Approved for checkbox options
export const filterTravelApprovedArray = (name, value) => (dispatch, getState) => {
  // get filter data
  let paramFilter = getState().securityFilter;
  

  // get filter from url
  let filterParams = getState().security.queryParamsApprovedTravel;

  // parameter value that need to be checked
  let paramValue = '&' + name + '[]=' + value

  let stateName = paramFilter[name];
  let arrIndex = stateName.indexOf(value);

  if (arrIndex >= 0) {
    stateName = stateName.filter((data, index) => index !== arrIndex)
    if (filterParams.indexOf(paramValue) > -1) {
      filterParams = filterParams.replace(paramValue, '')
    }
  } else {
    stateName = [...stateName, value]
    filterParams = filterParams + paramValue
  }

  dispatch(paramOnChange('queryParamsApprovedTravel', filterParams));
  dispatch(paramOnChange('loadData',true));

  return dispatch(onChange(name, stateName));
}

// Update Filter for non checkbox options (search, period date)
export const filterOnChange = (name, value, isDate) => (dispatch, getState) => {
  let filterParams = getState().security.queryParams
  let filter = getState().securityFilter

  filter = filter[name];
  if (isDate) {
    value = value.replace(/[^0-9-]/g, "")
  } else {
    value = value.replace(/[^a-zA-Z ]/g, "")
  }

  const oldParamValue = '&' + name + '=' + filter
  const newParamValue = '&' + name + '=' + value

  if (filterParams.indexOf(oldParamValue) > -1) {
    if (isDate && isEmpty(value)) {
      filterParams = filterParams.replace(oldParamValue, '')
    } else {
      filterParams = filterParams.replace(oldParamValue, newParamValue)
    }
  } else {
    filterParams = filterParams + newParamValue
  }

  if (filter !== value) {
    dispatch(paramOnChange('queryParams', filterParams))
    return dispatch(onChange(name, value))
  }

  return true;
}

// Travel Dashboard - Update Filter for checkbox options no array for approval travel
export const filterTravelApprovedOnChange = (name, value) => (dispatch, getState) => {
  let filterParams = getState().security.queryParamsApprovedTravel;
  let filter = getState().securityFilter;
  let oldParamValue = '';
  let newParamValue = '';

  filter = filter[name];

  if(name === 'date'){
    oldParamValue = '?' + name + '=' + filter;
    newParamValue = '?' + name + '=' + value;
  }else{
     if(name != 'searchImmaper'){
       value = value == filter ? 0 : 1;
     }
     oldParamValue = '&' + name + '=' + filter;
     newParamValue = '&' + name + '=' + value;
  }

  if (filterParams.indexOf(oldParamValue) > -1) {
    if (isEmpty(value) || value == 0) {
      filterParams = filterParams.replace(oldParamValue, '');
    } else {
      filterParams = filterParams.replace(oldParamValue, newParamValue);
    }
  } else {
    filterParams = filterParams + newParamValue;
  }

  if (filter !== value) {
    dispatch(paramOnChange('queryParamsApprovedTravel', filterParams));
    dispatch(paramOnChange('loadData',true));
    return dispatch(onChange(name, value));
  }

  return true;
}
