import {
	SET_LEGAL_PERMANENT_RESIDENCE_STATUS,
	ONCHANGE_LEGAL_PERMANENT_RESIDENCE_STATUS,
	SET_LEGAL_PERMANENT_RESIDENCE_STATUS_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	legal_permanent_residence_status: 0,
	legal_permanent_residence_status_counts: 0,
	legal_permanent_residence_status_countries: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_LEGAL_PERMANENT_RESIDENCE_STATUS:
			return {
				...state,
				id: action.legal.id,
				legal_permanent_residence_status: action.legal.legal_permanent_residence_status,
				legal_permanent_residence_status_counts: action.legal.legal_permanent_residence_status_counts,
				legal_permanent_residence_status_countries: action.legal.legal_permanent_residence_status_countries,
				show: action.legal.show
			};
		case SET_LEGAL_PERMANENT_RESIDENCE_STATUS_WITH_OUT_SHOW:
			return {
				...state,
				id: action.legal.id,
				legal_permanent_residence_status: action.legal.legal_permanent_residence_status,
				legal_permanent_residence_status_counts: action.legal.legal_permanent_residence_status_counts,
				legal_permanent_residence_status_countries: action.legal.legal_permanent_residence_status_countries
			};
		case ONCHANGE_LEGAL_PERMANENT_RESIDENCE_STATUS:
			return {
				...state,
				[action.name]: action.value
			};
		case 'legal_permanent_residence_status':
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
