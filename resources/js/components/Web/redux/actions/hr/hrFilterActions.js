import { SET_FILTER_DATA, RESET_HR_FILTER } from '../../types/hr/HRFilterTypes';
import { SET_ROSTER_DATA } from '../../types/roster/roster';
import {
  getDegreeLevels,
  getLanguages,
  getApprovedSectors,
  getSkillsForMatching,
  getApprovedFieldOfWorks,
  getP11Countries,
  getNationalities
} from '../../actions/optionActions';
import { getApplicantProfiles } from '../../actions/jobs/applicantActions';
import { getRosterProfile, onChange as onRosterChange } from '../../actions/roster/rosterActions';

import isEmpty from '../../../validations/common/isEmpty';
import { pluck } from '../../../utils/helper';

export const onChange = (name, value, noRefreshData = false) => (dispatch, getState) => {
  let { filterFor } = getState().filter;
  if ((filterFor == 'applicant' || filterFor == 'roster') && noRefreshData) {
    return dispatch({
      type: SET_FILTER_DATA,
      name,
      value
    });
  } else if (filterFor == 'applicant') {
    dispatch({
      type: SET_FILTER_DATA,
      name,
      value
    });
    return dispatch(getApplicantProfiles());
  } else if (filterFor == 'roster') {
    dispatch({
      type: SET_FILTER_DATA,
      name,
      value
    });
    return dispatch(getRosterProfile());
  }
};

export const selectOnChange = (value, e) => {
  return (dispatch) => {
    return dispatch(onChange([e.name], value));
  };
};

export const immaperOnChange = (value, isChecked) => (dispatch, getState) => {
  let { immaper_status } = getState().filter;

  if (isChecked) {
    immaper_status.push(value);
  } else {
    let dataIndex = immaper_status.indexOf(value);
    dataIndex > -1 && immaper_status.splice(dataIndex, 1);
  }

  dispatch(onChange('immaper_status', immaper_status, true));

  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }

  if (getState().filter.filterFor == 'roster') {
    return dispatch(getRosterProfile());
  }
};

export const genderOnChange = (value, isChecked) => (dispatch, getState) => {
  let { select_gender } = getState().filter;

  if (isChecked) {
    select_gender.push(value);
  } else {
    let dataIndex = select_gender.indexOf(value);
    dataIndex > -1 && select_gender.splice(dataIndex, 1);
  }

  dispatch(onChange('select_gender', select_gender, true));

  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }

  if (getState().filter.filterFor == 'roster') {
    return dispatch(getRosterProfile());
  }
};

export const torMinimumOnChange = (isChecked) => (dispatch, getState) => {
  dispatch(onChange('minimumRequirements', isChecked, true));
  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }
};

export const availableOnChange = (value, isChecked) => (dispatch, getState) => {
  let { is_available } = getState().filter;

  if (isChecked) {
    is_available.push(value);
  } else {
    let dataIndex = is_available.indexOf(value);
    dataIndex > -1 && is_available.splice(dataIndex, 1);
  }

  dispatch(onChange('is_available', is_available, true));

  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }

  if (getState().filter.filterFor == 'roster') {
    return dispatch(getRosterProfile());
  }
};


export const resetFilter = () => (dispatch, getState) => {
  dispatch({ type: RESET_HR_FILTER });
  let {
    degree_levels,
    languages,
    approvedSectors,
    skillsForMatching,
    approvedFieldOfWorks,
    p11Countries,
    nationalities
  } = getState().options;

  dispatch(onChange('language_lists', languages, true));
  dispatch(onChange('degree_level_lists', degree_levels, true));
  dispatch(onChange('sector_lists', approvedSectors, true));
  dispatch(onChange('field_of_work_lists', approvedFieldOfWorks, true));
  dispatch(onChange('skill_lists', skillsForMatching, true));
  dispatch(onChange('country_lists', p11Countries, true));
  dispatch(onChange('nationality_lists', nationalities, true));
  dispatch(onRosterChange('showAllRejected', false));

  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }

  if (getState().filter.filterFor == 'roster') {
    return dispatch(getRosterProfile());
  }
};

export const filterCheckbox = (name, value, variableIsOpen, isChecked, parameterVariable, usingDialog) => (
  dispatch,
  getState
) => {

  let filterData = getState().filter[name];
  let filterDataId = pluck(filterData, 'id');
  let dataIndex = filterDataId.indexOf(value);
  if (dataIndex < 0 && isChecked && usingDialog) {
    let paramValue = getState().filter[parameterVariable];
    paramValue.id = value;
    filterData.push(paramValue);
    dispatch(onChange(variableIsOpen, getState().filter[variableIsOpen] ? false : true, true));
    dispatch(onChange(parameterVariable, paramValue, true));
  } else if (!usingDialog && isChecked) {
    filterData.push({ id: value });
  } else {
    dataIndex > -1 && filterData.splice(dataIndex, 1);
  }

  dispatch(onChange(name, filterData, true));
  if (getState().filter.filterFor == 'applicant') {
    return dispatch(getApplicantProfiles());
  }

  if (getState().filter.filterFor == 'roster') {
    return dispatch(getRosterProfile());
  }
};

export const searchOnChange = (name, value, optionVariable, optionDefaultVariable) => (dispatch, getState) => {
  dispatch(onChange(name, value, true));
  let data = getState().options[optionDefaultVariable];
  let filteredData = data.filter((option) => option.label.toLowerCase().indexOf(value.toLowerCase()) == 0);

  if (isEmpty(value) || isEmpty(filteredData)) {
    return dispatch(onChange(optionVariable, filteredData, true));
  } else {
    return dispatch(onChange(optionVariable, filteredData, true));
  }
};

export const setParameters = (variable_name, parameters, variableIsOpen) => (dispatch, getState) => {
  let chosen_data = getState().filter[variable_name];
  let arrIds = pluck(chosen_data, 'id');

  if (arrIds.length > 0) {
    let arrIndex = arrIds.indexOf(parameters.id);
    if (arrIndex > -1) {
      chosen_data[arrIndex] = parameters;

      dispatch(onChange(variable_name, chosen_data, true));
      dispatch(onChange(variableIsOpen, false, true));
      if (getState().filter.filterFor == 'applicant') {
        return dispatch(getApplicantProfiles());
      }
      if (getState().filter.filterFor == 'roster') {
        return dispatch(getRosterProfile());
      }
    }
  }
};

export const getFilter = (filterFor, requirements) => async (dispatch, getState) => {
  await dispatch(getNationalities());
  await dispatch(getP11Countries());
  await dispatch(getDegreeLevels());
  await dispatch(getLanguages());
  await dispatch(getApprovedSectors());
  await dispatch(getApprovedFieldOfWorks());
  await dispatch(getSkillsForMatching());
  await dispatch(onChange('filterFor', filterFor, true));
  let {
    degree_levels,
    languages,
    approvedSectors,
    skillsForMatching,
    approvedFieldOfWorks,
    nationalities,
    p11Countries
  } = getState().options;

  dispatch(onChange('nationality_lists', nationalities, true));
  dispatch(onChange('language_lists', languages, true));
  dispatch(onChange('degree_level_lists', degree_levels, true));
  dispatch(onChange('sector_lists', approvedSectors, true));
  dispatch(onChange('field_of_work_lists', approvedFieldOfWorks, true));
  dispatch(onChange('country_lists', p11Countries, true));
  dispatch(onChange('country_of_residence_lists', p11Countries, true));
  return dispatch(onChange('skill_lists', skillsForMatching, true));
};

export const closeDialog = (variableIsOpen) => (dispatch, getState) => {
  let isOpen = getState().filter[variableIsOpen];
  return dispatch(onChange(variableIsOpen, isOpen ? false : true));
};
