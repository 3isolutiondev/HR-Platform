import {
	SET_DISABILITIES,
	ONCHANGE_DISABILITIES,
	SET_DISABILITIES_WITH_OUT_SHOW
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	has_disabilities: 1,
	disabilities: '',
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_DISABILITIES:
			return {
				...state,
				id: action.disabilities.id,
				has_disabilities: action.disabilities.has_disabilities,
				disabilities: action.disabilities.disabilities,
				show: action.disabilities.show
			};
		case SET_DISABILITIES_WITH_OUT_SHOW:
			return {
				...state,
				id: action.disabilities.id,
				has_disabilities: action.disabilities.has_disabilities,
				disabilities: action.disabilities.disabilities
			};
		case ONCHANGE_DISABILITIES:
			return {
				...state,
				[action.name]: action.value
			};
		case 'disabilities':
			return {
				...state,
				show: action.value
			};
		default:
			return state;
	}
};
