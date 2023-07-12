import {
	SET_TOR_RECOMMENDATION,
	SET_BULK_TOR_RECOMMENDATION,
	RESET_TOR_RECOMMENDATION
} from '../../types/tor/torRecommendationTypes';

const initialState = {
	profiles: [],
	title: '',
	country: '',
  current_page: 1,
  last_page: 1
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_TOR_RECOMMENDATION:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_TOR_RECOMMENDATION:
			let torRecommendations = { ...state };

			Object.keys(torRecommendations).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					torRecommendations[key] = action.bulkData[key];
				}
			});

			return torRecommendations;
		case RESET_TOR_RECOMMENDATION:
			return initialState;
		default:
			return state;
	}
};
