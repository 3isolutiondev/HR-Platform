import {
	SET_JOB_RECOMMENDATION,
	SET_BULK_JOB_RECOMMENDATION,
	RESET_JOB_RECOMMENDATION
} from '../../types/jobs/jobRecommendationTypes';

const initialState = {
	profiles: [],
	title: '',
	job_id: '',
	country: '',
  current_page: 1,
  last_page: 1
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_JOB_RECOMMENDATION:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_JOB_RECOMMENDATION:
			let jobRecommendations = { ...state };

			Object.keys(jobRecommendations).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					jobRecommendations[key] = action.bulkData[key];
				}
			});

			return jobRecommendations;
		case RESET_JOB_RECOMMENDATION:
			return initialState;
		default:
			return state;
	}
};
