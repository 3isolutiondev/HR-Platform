import {
	SET_RECOMMENDATION_DATA,
	RESET_RECOMMENDATION_DATA,
	SET_BULK_RECOMMENDATION_DATA
} from '../../types/common/RecommendationTypes';

const initialState = {
	allCheck: false,
	profileIds: [],
	profiles: [],
	canSendInvitation: false,
	errors: {},
	isLoading: false,
	loadingData: true,
	openProfile: false,
	selected_profile_id: '',
  firstApiCall: true
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_RECOMMENDATION_DATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_RECOMMENDATION_DATA:
			let recommendations = { ...state };

			Object.keys(recommendations).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					recommendations[key] = action.bulkData[key];
				}
			});

			return recommendations;
		case RESET_RECOMMENDATION_DATA:
			return initialState;
		default:
			return state;
	}
};
