import {
  SET_COMPLETED_PROFILE_FILTER_DATA,
  RESET_FILTER_COMPLETED_PROFILE_FILTER_DATA
} from '../../types/allprofiles/allProfilesTypes';

import {
  getDegreeLevels,
  getLanguages,
  getApprovedSectors,
  getSkillsForMatching,
  getApprovedFieldOfWorks,
  getP11Countries,
  getNationalities
} from '../../actions/optionActions';

import isEmpty from '../../../validations/common/isEmpty';
import { pluck } from '../../../utils/helper';

export const onChange = (name, value) => {
  return {
    type: SET_COMPLETED_PROFILE_FILTER_DATA,
    name,
    value
  };
};

export const selectOnChange = (value, e) => {
  return (dispatch) => {
    return dispatch(onChange([e.name], value));
  };
};

export const immaperOnChange = (value, isChecked) => (dispatch, getState) => {
  let immaper_status = [...getState().allProfilesFilter.immaper_status];

  if (isChecked) {
    immaper_status.push(value);
  } else {
    let dataIndex = immaper_status.indexOf(value);
    dataIndex > -1 && immaper_status.splice(dataIndex, 1);
  }

  return dispatch(onChange('immaper_status', immaper_status));
};

export const genderOnChange = (value, isChecked) => (dispatch, getState) => {
  let select_gender = [...getState().allProfilesFilter.select_gender];

  if (isChecked) {
    select_gender.push(value);
  } else {
    let dataIndex = select_gender.indexOf(value);
    dataIndex > -1 && select_gender.splice(dataIndex, 1);
  }

  return dispatch(onChange('select_gender', select_gender));
};

export const availableOnChange = (value, isChecked) => (dispatch, getState) => {
  let is_available = [...getState().allProfilesFilter.is_available];

  if (isChecked) {
    is_available.push(value);
  } else {
    let dataIndex = is_available.indexOf(value);
    dataIndex > -1 && is_available.splice(dataIndex, 1);
  }

  dispatch(onChange('is_available', is_available));
};

export const filterCheckbox = (name, value, variableIsOpen, isChecked, parameterVariable, usingDialog) => (
  dispatch,
  getState
) => {
  let filterData = [...getState().allProfilesFilter[name]];
  let filterDataId = pluck(filterData, 'id');
  let dataIndex = filterDataId.indexOf(value);

  if (dataIndex < 0 && isChecked && usingDialog) {
    let paramValue = {...getState().allProfilesFilter[parameterVariable]};
    paramValue.id = value;
    filterData.push(paramValue);
    dispatch(onChange(variableIsOpen, getState().allProfilesFilter[variableIsOpen] ? false : true));
    dispatch(onChange(parameterVariable, paramValue));
  } else if (!usingDialog && isChecked) {
    filterData.push({ id: value });
  } else {
    dataIndex > -1 && filterData.splice(dataIndex, 1);
  }
  return dispatch(onChange(name, filterData));
};

export const searchOnChange = (name, value, optionVariable, optionDefaultVariable) => (dispatch, getState) => {
  dispatch(onChange(name, value));
  let data = getState().options[optionDefaultVariable];
  let filteredData = data.filter((option) => option.label.toLowerCase().indexOf(value.toLowerCase()) == 0);

  if (isEmpty(value) || isEmpty(filteredData)) {
    return dispatch(onChange(optionVariable, filteredData));
  } else {
    return dispatch(onChange(optionVariable, filteredData));
  }
};

export const resetFilter = () => (dispatch, getState) => {
  dispatch({ type: RESET_FILTER_COMPLETED_PROFILE_FILTER_DATA });
  let {
    degree_levels,
    languages,
    approvedSectors,
    skillsForMatching,
    approvedFieldOfWorks,
    p11Countries,
    nationalities
  } = getState().options;

  dispatch(onChange('searchTemp', ''));
  dispatch(onChange('language_lists', languages));
  dispatch(onChange('degree_level_lists', degree_levels));
  dispatch(onChange('sector_lists', approvedSectors));
  dispatch(onChange('field_of_work_lists', approvedFieldOfWorks));
  dispatch(onChange('skill_lists', skillsForMatching));
  dispatch(onChange('country_lists', p11Countries));
  dispatch(onChange('nationality_lists', nationalities));
};

export const setParameters = (variable_name, parameters, variableIsOpen) => (dispatch, getState) => {
  let chosen_data = [...getState().allProfilesFilter[variable_name]];
  let arrIds = pluck(chosen_data, 'id');

  if (arrIds.length > 0) {
    let arrIndex = arrIds.indexOf(parameters.id);
    if (arrIndex > -1) {
      chosen_data[arrIndex] = parameters;

      dispatch(onChange(variable_name, chosen_data));
      return dispatch(onChange(variableIsOpen, false));
    }
  }
};

export const getFilter = () => async (dispatch, getState) => {
  // await dispatch(resetFilter());
  await dispatch(getNationalities());
  await dispatch(getP11Countries());
  await dispatch(getDegreeLevels());
  await dispatch(getLanguages());
  await dispatch(getApprovedSectors());
  await dispatch(getApprovedFieldOfWorks());
  await dispatch(getSkillsForMatching());
  let {
    degree_levels,
    languages,
    approvedSectors,
    skillsForMatching,
    approvedFieldOfWorks,
    nationalities,
    p11Countries
  } = getState().options;

  dispatch(onChange('nationality_lists', nationalities));
  dispatch(onChange('language_lists', languages));
  dispatch(onChange('degree_level_lists', degree_levels));
  dispatch(onChange('sector_lists', approvedSectors));
  dispatch(onChange('field_of_work_lists', approvedFieldOfWorks));
  dispatch(onChange('country_lists', p11Countries));
  dispatch(onChange('country_of_residence_lists', p11Countries));
  return dispatch(onChange('skill_lists', skillsForMatching));
};

export const closeDialog = (variableIsOpen) => (dispatch, getState) => {
  let isOpen = getState().allProfilesFilter[variableIsOpen];
  return dispatch(onChange(variableIsOpen, isOpen ? false : true));
};
