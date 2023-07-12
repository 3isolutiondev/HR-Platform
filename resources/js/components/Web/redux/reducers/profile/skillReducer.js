import { SET_SKILL, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	skills_counts: '',
	p11_skills: [],
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_SKILL:
			return {
				...state,
				id: action.skill.id,
				skills_counts: action.skill.skills_counts,
				p11_skills: action.skill.p11_skills,
				show: action.skill.show
			};
		case 'skills':
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
