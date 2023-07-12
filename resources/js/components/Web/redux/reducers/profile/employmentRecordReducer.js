import { SET_EMPLOYMENT_RECORDS, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	employment_records_counts: '',
	employment_records: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_EMPLOYMENT_RECORDS:
			return {
				...state,
				id: action.employment.id,
				employment_records_counts: action.employment.employment_records_counts,
				employment_records: action.employment.employment_records,
				show: action.employment.show
			};
		case 'employment_records':
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
