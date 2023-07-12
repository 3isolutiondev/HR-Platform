import {
	SET_RELEVAN_FACT,
	ONCHANGE_RELEVAN_FACT,
	SET_RELEVAN_FACT_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	relevant_facts: '',
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_RELEVAN_FACT:
			return {
				...state,
				id: action.relevan.id,
				relevant_facts: action.relevan.relevant_facts,
				show: action.relevan.show
			};
		case SET_RELEVAN_FACT_WITH_OUT_SHOW:
			return {
				...state,
				id: action.relevan.id,
				relevant_facts: action.relevan.relevant_facts
			};
		case ONCHANGE_RELEVAN_FACT:
			return {
				...state,
				[action.name]: action.value
			};
		case 'relevant_facts':
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
