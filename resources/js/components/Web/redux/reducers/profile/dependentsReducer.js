import { SET_DEPENDENTS, SET_DEPENDENTS_WITHOUT_SHOW } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	has_dependents: 0,
	dependents_counts: 0,
	dependents: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_DEPENDENTS:
			return {
				...state,
				id: action.dependent.id,
				has_dependents: action.dependent.has_dependents,
				dependents_counts: action.dependent.dependents_counts,
				dependents: action.dependent.dependents,
				show: action.dependent.show
			};
		case SET_DEPENDENTS_WITHOUT_SHOW:
			return {
				...state,
				id: action.dependent.id,
				has_dependents: action.dependent.has_dependents,
				dependents_counts: action.dependent.dependents_counts,
				dependents: action.dependent.dependents
			};
		case 'dependents':
			return {
				...state,
				show: action.value
			};
		default:
			return state;
	}
};
