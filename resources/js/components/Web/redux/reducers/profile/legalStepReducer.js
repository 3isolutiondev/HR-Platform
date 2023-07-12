import {
	SET_LEGAL_STEP,
	ONCHANGE_LEGAL_STEP,
	SET_LEGAL_STEP_WITH_OUT_SHOW,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	legal_step_changing_present_nationality: 0,
	legal_step_changing_present_nationality_explanation: '',
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_LEGAL_STEP:
			return {
				...state,
				id: action.legalStep.id,
				legal_step_changing_present_nationality: action.legalStep.legal_step_changing_present_nationality,
				legal_step_changing_present_nationality_explanation:
					action.legalStep.legal_step_changing_present_nationality_explanation,
				show: action.legalStep.show
			};
		case SET_LEGAL_STEP_WITH_OUT_SHOW:
			return {
				...state,
				id: action.legalStep.id,
				legal_step_changing_present_nationality: action.legalStep.legal_step_changing_present_nationality,
				legal_step_changing_present_nationality_explanation:
					action.legalStep.legal_step_changing_present_nationality_explanation
			};
		case ONCHANGE_LEGAL_STEP:
			return {
				...state,
				[action.name]: action.value
			};
		case 'legal_step_changing_present_nationality_explanation':
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
