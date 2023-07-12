import {
	SET_RELATIVE_EMPLOYED,
	SET_RELATIVE_EMPLOYED_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	relatives_employed_counts: 0,
	relatives_employed: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_RELATIVE_EMPLOYED:
			return {
				...state,
				id: action.employed.id,
				relatives_employed_counts: action.employed.relatives_employed_counts,
				relatives_employed: action.employed.relatives_employed,
				show: action.employed.show
			};
		case SET_RELATIVE_EMPLOYED_WITH_OUT_SHOW:
			return {
				...state,
				id: action.employed.id,
				relatives_employed_counts: action.employed.relatives_employed_counts,
				relatives_employed: action.employed.relatives_employed
			};
		case 'relatives_employed':
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
