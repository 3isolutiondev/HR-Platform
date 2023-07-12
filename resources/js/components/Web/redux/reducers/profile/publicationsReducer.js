import { SET_PUBLICATION, SET_PUBLICATION_WITH_OUT_SHOW, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	publications_counts: '',
	publications: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PUBLICATION:
			return {
				...state,
				id: action.publication.id,
				publications_counts: action.publication.publications_counts,
				publications: action.publication.publications,
				show: action.publication.show
			};
		case SET_PUBLICATION_WITH_OUT_SHOW:
			return {
				...state,
				id: action.publication.id,
				publications_counts: action.publication.publications_counts,
				publications: action.publication.publications
			};
		case 'publications':
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
