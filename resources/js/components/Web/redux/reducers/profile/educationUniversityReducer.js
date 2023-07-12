import { SET_UNIVERSITY, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	education_universities_counts: '',
	education_universities: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_UNIVERSITY:
			return {
				...state,
				education_universities_counts: action.university.education_universities_counts,
				education_universities: action.university.education_universities,
				show: action.university.show
			};
		case 'education_universities':
			return {
				...state,
				show: action.value
			};
		case RESET_PROFILE:
			return initialState;
		default:
			return state;
	}
};
