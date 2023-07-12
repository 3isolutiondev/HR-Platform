import { SET_PORTOFOLIO, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	portfolios_counts: '',
	portfolios: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PORTOFOLIO:
			return {
				...state,
				id: action.portofolio.id,
				portfolios_counts: action.portofolio.portfolios_counts,
				portfolios: action.portofolio.portfolios,
				show: action.portofolio.show
			};
		case 'portfolios':
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
