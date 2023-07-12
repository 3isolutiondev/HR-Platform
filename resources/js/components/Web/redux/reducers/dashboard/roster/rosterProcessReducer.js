import {
	SET_ROSTER_PROCESS_FORMDATA,
	SET_BULK_ROSTER_PROCESS_FORMDATA,
	RESET_ROSTER_PROCESS_FORMDATA,
	SET_ROSTER_STEP_FORMDATA,
	SET_BULK_ROSTER_STEP_FORMDATA,
	RESET_ROSTER_STEP_FORMDATA
} from '../../../types/dashboard/roster/rosterProcesses';

const initialState = {
	rosterProcess: {
		id: '',
		name: '',
    description: '',
    read_more_text: '',
		is_default: 0,
    under_sbp_program: 'no',
    campaign_is_open: "no",
    campaign_open_at_quarter: "",
    campaign_open_at_year: "",
		roster_steps: [],
		errors: {},
		isEdit: false,
		apiURL: '/api/roster-processes',
		redirectURL: '/dashboard/roster-processes',
		showLoading: false,
    skillsets: [],
    skillset: ''
	},
	rosterStep: {
		id: '',
		order: 0,
		step: '',
		default_step: 0,
		last_step: 0,
		has_quiz: 0,
		has_im_test: 0,
		has_skype_call: 0,
		has_interview: 0,
		has_reference_check: 0,
		set_rejected: 0,
		quiz_template: [],
		isOpen: false,
		isEdit: false,
		errors: {},
		showLoading: false
	}
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_ROSTER_PROCESS_FORMDATA:
			return {
				...state,
				rosterProcess: {
					...state.rosterProcess,
					[action.name]: action.value
				}
			};
		case SET_BULK_ROSTER_PROCESS_FORMDATA:
			let rosterProcess = { ...state };
			Object.keys(rosterProcess.rosterProcess).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					state.rosterProcess[key] = action.bulkData[key];
				}
			});

			return rosterProcess;
		case RESET_ROSTER_PROCESS_FORMDATA:
			return {
				...state,
				rosterProcess: initialState.rosterProcess
			};
		case SET_ROSTER_STEP_FORMDATA:
			return {
				...state,
				rosterStep: {
					...state.rosterStep,
					[action.name]: action.value
				}
			};
		case SET_BULK_ROSTER_STEP_FORMDATA:
			let rosterProcess2 = { ...state };
			Object.keys(rosterProcess2.rosterStep).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					state.rosterStep[key] = action.bulkData[key];
				}
			});

			return rosterProcess2;
		case RESET_ROSTER_STEP_FORMDATA:
			return {
				...state,
				rosterStep: initialState.rosterStep
			};
		default:
			return state;
	}
};
