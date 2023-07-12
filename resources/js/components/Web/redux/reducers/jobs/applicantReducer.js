import { SET_APPLICANT_LISTS, SET_BULK_APPLICANT_LISTS, RESET_APPLICANT_LISTS } from '../../types/jobs/applicantTypes';

const initialState = {
	job_id: '',
	jobStatusTab: 0,
	lastStepIndex: '',
    interviewIndex: 0,
	profiles: [],
	moveduser: [],
	isManager: '',
	openProfile: false,
	openRequestContract: false,
	selected_profile_id: '',
	job_status: [],

	current_page: 1,
	first_page_url: '',
	from: 1,
	last_page: 1,
	last_page_url: '',
	next_page_url: '',
	path: '',
	per_page: 2,
	prev_page_url: '',
	to: 1,
	total: 0,
  job_standard_under_sbp_program: false,
  openAvailability: false,
  show_start_date_availability: '',
  show_departing_from: '',
  show_full_name: ''
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_APPLICANT_LISTS:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_APPLICANT_LISTS:
			let applicant_lists = { ...state };

			Object.keys(applicant_lists).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					applicant_lists[key] = action.bulkData[key];
				}
			});

			return applicant_lists;
		case RESET_APPLICANT_LISTS:
			return initialState;
		default:
			return state;
	}
};
