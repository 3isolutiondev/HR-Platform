import { SET_LANGUAGE, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	languages_counts: '',
	languages: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_LANGUAGE:
			return {
				...state,
				languages_counts: action.language.languages_counts,
				languages: action.language.languages,
				show: action.language.show
			};
		case 'languages':
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
