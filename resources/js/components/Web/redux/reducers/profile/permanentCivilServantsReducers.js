import {
	SET_PERMANENT_CIVIL_SERVANTS,
	SET_PERMANENT_CIVIL_SERVANTS_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	permanent_civil_servant: 0,
	permanent_civil_servants_counts: 0,
	permanent_civil_servants: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PERMANENT_CIVIL_SERVANTS:
			return {
				...state,
				id: action.pcs.id,
				permanent_civil_servant: action.pcs.permanent_civil_servant,
				permanent_civil_servants_counts: action.pcs.permanent_civil_servants_counts,
				permanent_civil_servants: action.pcs.permanent_civil_servants,
				show: action.pcs.show
			};
		case SET_PERMANENT_CIVIL_SERVANTS_WITH_OUT_SHOW:
			return {
				...state,
				id: action.pcs.id,
				permanent_civil_servant: action.pcs.permanent_civil_servant,
				permanent_civil_servants_counts: action.pcs.permanent_civil_servants_counts,
				permanent_civil_servants: action.pcs.permanent_civil_servants
			};
		case 'permanent_civil_servants':
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
