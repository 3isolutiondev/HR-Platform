import { SET_SCHOOL, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	education_schools_counts: '',
	education_schools: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_SCHOOL:
			return {
				...state,
				education_schools_counts: action.school.education_schools_counts,
				education_schools: action.school.education_schools,
				show: action.school.show
			};
		case 'education_schools':
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
