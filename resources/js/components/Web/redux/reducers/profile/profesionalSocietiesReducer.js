import { SET_PROFESIONAL_SOCIETIES, SET_PROFESIONAL_SOCIETIES_WITH_OUT_SHOW } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	professional_societies_counts: '',
	professional_societies: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PROFESIONAL_SOCIETIES:
			return {
				...state,
				id: action.societies.id,
				professional_societies_counts: action.societies.professional_societies_counts,
				professional_societies: action.societies.professional_societies,
				show: action.societies.show
			};
		case SET_PROFESIONAL_SOCIETIES_WITH_OUT_SHOW:
			return {
				...state,
				id: action.societies.id,
				professional_societies_counts: action.societies.professional_societies_counts,
				professional_societies: action.societies.professional_societies
			};
		case 'professional_societies':
			return {
				...state,
				show: action.value
			};

		default:
			return state;
	}
};
