import {
	SET_JOB_RECOMMENDATION_FILTER_DATA,
	RESET_JOB_RECOMMENDATION_FILTER
} from '../../types/jobs/jobRecommendationFilterTypes';

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
import { getRosterProfile } from '../../actions/roster/rosterActions';

import isEmpty from '../../../validations/common/isEmpty';
import { pluck } from '../../../utils/helper';

// export const onChange = (name, value, noRefreshData = false) => (dispatch, getState) => {
// 	let { filterFor } = getState().filter;
// 	if ((filterFor == 'applicant' || filterFor == 'roster') && noRefreshData) {
// 		return dispatch({
// 			type: SET_JOB_RECOMMENDATION_FILTER_DATA,
// 			name,
// 			value
// 		});
// 	} else if (filterFor == 'applicant') {
// 		dispatch({
// 			type: SET_JOB_RECOMMENDATION_FILTER_DATA,
// 			name,
// 			value
// 		});
// 		return dispatch(getApplicantProfiles());
// 	} else if (filterFor == 'roster') {
// 		dispatch({
// 			type: SET_JOB_RECOMMENDATION_FILTER_DATA,
// 			name,
// 			value
// 		});
// 		return dispatch(getRosterProfile());
// 	}
// };

export const onChange = (name, value) => (dispatch, getState) => {
	return dispatch({
		type: SET_JOB_RECOMMENDATION_FILTER_DATA,
		name,
		value
	});
};

export const selectOnChange = (value, e) => {
	return (dispatch) => {
		return dispatch(onChange([e.name], value));
	};
};

export const immaperOnChange = (value, isChecked) => (dispatch, getState) => {
	let immaper_status = JSON.parse(JSON.stringify(getState().jobRecommendationFilter.immaper_status));

	if (isChecked) {
		// immaper_status = [ value ];
		immaper_status.push(value);
	} else {
		let dataIndex = immaper_status.indexOf(value);
		dataIndex > -1 && immaper_status.splice(dataIndex, 1);
	}

	return dispatch(onChange('immaper_status', immaper_status, true));

	// if (getState().filter.filterFor == 'applicant') {
	// 	return dispatch(getApplicantProfiles());
	// }

	// if (getState().filter.filterFor == 'roster') {
	// 	return dispatch(getRosterProfile());
	// }
};

export const genderOnChange = (value, isChecked) => (dispatch, getState) => {
	let select_gender = JSON.parse(JSON.stringify(getState().jobRecommendationFilter.select_gender));

	if (isChecked) {
		select_gender.push(value);
	} else {
		let dataIndex = select_gender.indexOf(value);
		dataIndex > -1 && select_gender.splice(dataIndex, 1);
	}

	return dispatch(onChange('select_gender', select_gender, true));
};

export const availableOnChange = (value, isChecked) => (dispatch, getState) => {
	let is_available = JSON.parse(JSON.stringify(getState().jobRecommendationFilter.is_available));

	if (isChecked) {
		// is_available = [ value ];
		is_available.push(value);
	} else {
		let dataIndex = is_available.indexOf(value);
		dataIndex > -1 && is_available.splice(dataIndex, 1);
	}

	dispatch(onChange('is_available', is_available, true));

	// if (getState().filter.filterFor == 'applicant') {
	// 	return dispatch(getApplicantProfiles());
	// }

	// if (getState().filter.filterFor == 'roster') {
	// 	return dispatch(getRosterProfile());
	// }
};

export const resetFilter = () => (dispatch, getState) => {
	dispatch({ type: RESET_JOB_RECOMMENDATION_FILTER });
	// dispatch(getFilter());
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

	// if (getState().filter.filterFor == 'applicant') {
	// 	return dispatch(getApplicantProfiles());
	// }

	// if (getState().filter.filterFor == 'roster') {
	// 	return dispatch(getRosterProfile());
	// }
};

// export const filterCheckbox = (name, value, variableIsOpen, isChecked, parameterVariable, usingDialog) => (
// 	dispatch,
// 	getState
// ) => {
// 	let filterData = getState().filter[name];
// 	let filterDataId = pluck(filterData, 'id');
// 	let dataIndex = filterDataId.indexOf(value);

// 	if (dataIndex < 0 && isChecked && usingDialog) {
// 		let paramValue = getState().filter[parameterVariable];
// 		paramValue.id = value;
// 		filterData.push(paramValue);
// 		dispatch(onChange(variableIsOpen, getState().filter[variableIsOpen] ? false : true, true));
// 		dispatch(onChange(parameterVariable, paramValue, true));
// 	} else if (!usingDialog && isChecked) {
// 		filterData.push({ id: value });
// 	} else {
// 		dataIndex > -1 && filterData.splice(dataIndex, 1);
// 	}

// 	dispatch(onChange(name, filterData, true));
// 	if (getState().filter.filterFor == 'applicant') {
// 		return dispatch(getApplicantProfiles());
// 	}

// 	if (getState().filter.filterFor == 'roster') {
// 		return dispatch(getRosterProfile());
// 	}
// };

export const filterCheckbox = (name, value, variableIsOpen, isChecked, parameterVariable, usingDialog) => (
	dispatch,
	getState
) => {
	let filterData = JSON.parse(JSON.stringify(getState().jobRecommendationFilter[name]));
	let filterDataId = pluck(filterData, 'id');
	let dataIndex = filterDataId.indexOf(value);

	if (dataIndex < 0 && isChecked && usingDialog) {
		let paramValue = JSON.parse(JSON.stringify(getState().jobRecommendationFilter[parameterVariable]));
		paramValue.id = value;
		filterData.push(paramValue);
		dispatch(onChange(variableIsOpen, getState().jobRecommendationFilter[variableIsOpen] ? false : true));
		dispatch(onChange(parameterVariable, paramValue));
	} else if (!usingDialog && isChecked) {
		filterData.push({ id: value });
	} else {
		dataIndex > -1 && filterData.splice(dataIndex, 1);
	}
	return dispatch(onChange(name, filterData, false));
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

// export const setParameters = (variable_name, parameters, variableIsOpen) => (dispatch, getState) => {
// 	let chosen_data = getState().filter[variable_name];
// 	let arrIds = pluck(chosen_data, 'id');

// 	if (arrIds.length > 0) {
// 		let arrIndex = arrIds.indexOf(parameters.id);
// 		if (arrIndex > -1) {
// 			chosen_data[arrIndex] = parameters;

// 			dispatch(onChange(variable_name, chosen_data, true));
// 			dispatch(onChange(variableIsOpen, false, true));
// 			if (getState().filter.filterFor == 'applicant') {
// 				return dispatch(getApplicantProfiles());
// 			}
// 			if (getState().filter.filterFor == 'roster') {
// 				return dispatch(getRosterProfile());
// 			}
// 		}
// 	}
// };
export const setParameters = (variable_name, parameters, variableIsOpen) => (dispatch, getState) => {
	let chosen_data = JSON.parse(JSON.stringify(getState().jobRecommendationFilter[variable_name]));
	let arrIds = pluck(chosen_data, 'id');

	if (arrIds.length > 0) {
		let arrIndex = arrIds.indexOf(parameters.id);
		if (arrIndex > -1) {
			chosen_data[arrIndex] = parameters;

			dispatch(onChange(variable_name, chosen_data, true));
			return dispatch(onChange(variableIsOpen, false, true));
		}
	}
};

export const getFilter = (filterFor) => async (dispatch, getState) => {
	// await dispatch(resetFilter());
	await dispatch(getNationalities());
	await dispatch(getP11Countries());
	await dispatch(getDegreeLevels());
	await dispatch(getLanguages());
	await dispatch(getApprovedSectors());
	await dispatch(getApprovedFieldOfWorks());
	await dispatch(getSkillsForMatching());
	// await dispatch(onChange('filterFor', filterFor, true));
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
	let isOpen = getState().jobRecommendationFilter[variableIsOpen];
	return dispatch(onChange(variableIsOpen, isOpen ? false : true));
};
