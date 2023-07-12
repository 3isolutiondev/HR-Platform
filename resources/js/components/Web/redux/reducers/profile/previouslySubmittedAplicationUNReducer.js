import {
	SET_PREVIOUSLY_SUBMITTED_FOR_UN,
	SET_PREVIOUSLY_SUBMITTED_FOR_UN_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	previously_submitted_application_for_UN: '',
	previously_submitted_for_un_counts: 0,
	previously_submitted_for_un: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PREVIOUSLY_SUBMITTED_FOR_UN:
			return {
				...state,
				id: action.un.id,
				previously_submitted_application_for_UN: action.un.previously_submitted_application_for_UN,
				previously_submitted_for_un_counts: action.un.previously_submitted_for_un_counts,
				previously_submitted_for_un: action.un.previously_submitted_for_un,
				show: action.un.show
			};
		case SET_PREVIOUSLY_SUBMITTED_FOR_UN_WITH_OUT_SHOW:
			return {
				...state,
				id: action.un.id,
				previously_submitted_application_for_UN: action.un.previously_submitted_application_for_UN,
				previously_submitted_for_un_counts: action.un.previously_submitted_for_un_counts,
				previously_submitted_for_un: action.un.previously_submitted_for_un
			};
		case 'previously_submitted_for_un':
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
