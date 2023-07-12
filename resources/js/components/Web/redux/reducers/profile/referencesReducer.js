import { SET_REFERENCES, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	references_counts: 0,
	references: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_REFERENCES:
			return {
				...state,
				id: action.references.id,
				references_counts: action.references.references_counts,
				references: action.references.references,
				show: action.references.show
			};
		case 'references':
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
