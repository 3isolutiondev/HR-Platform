import { SET_RECOMMENDATION_DATA, SET_BULK_RECOMMENDATION_DATA } from '../../types/common/RecommendationTypes';
import { pluck } from '../../../utils/helper';

export const onChange = (name, value) => {
  return {
    type: SET_RECOMMENDATION_DATA,
    name,
    value
  }
}

export const bulkOnChange = (bulkData) => {
  return {
    type: SET_BULK_RECOMMENDATION_DATA,
    bulkData
  }
}

export const allCheckOnChange = () => (dispatch, getState) => {
	let { allCheck, profiles } = getState().recommendations;

	return dispatch({
		type: SET_BULK_RECOMMENDATION_DATA,
		bulkData: {
			allCheck: allCheck ? false : true,
			profileIds: allCheck ? [] : pluck(profiles, 'id')
		}
	});
};

export const openCloseProfile = (profile_id = null) => (dispatch, getState) => {
	const { openProfile } = getState().recommendations;

	if (openProfile) {
		return dispatch({
			type: SET_BULK_RECOMMENDATION_DATA,
			bulkData: {
				selected_profile_id: '',
				openProfile: false
			}
		});
	} else {
		return dispatch({
			type: SET_BULK_RECOMMENDATION_DATA,
			bulkData: {
				selected_profile_id: profile_id,
				openProfile: true
			}
		});
	}
};

export const checkChange = (profile_id) => (dispatch, getState) => {
	let { profileIds } = getState().recommendations;
	let isCheck = profileIds.includes(profile_id);

	if (isCheck) {
		let index = profileIds.indexOf(profile_id);
		if (index >= 0) {
			profileIds.splice(index, 1);
		}
	} else {
		profileIds.push(profile_id);
	}

	return dispatch({
		type: SET_RECOMMENDATION_DATA,
		name: 'profileIds',
		value: profileIds
	});
};
