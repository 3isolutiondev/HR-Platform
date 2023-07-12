import { SET_PHONE_NUMBER, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	phones: [],
	phone_counts: 0,
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PHONE_NUMBER:
			return {
				...state,
				phones: action.phones.phones,
				phone_counts: action.phones.phone_counts,
				show: action.phones.show
			};
		case 'phone_number':
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
