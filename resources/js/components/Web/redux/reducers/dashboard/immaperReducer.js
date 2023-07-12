import { SET_IMMAPER_FORMDATA, SET_IMMAPER_DATA } from '../../types/dashboard/immaperTypes';
import moment from 'moment';

const initialState = {
	profile_id: null,
	full_name: '',
	p11Completed: 0,
	immap_email: '',
	job_title: '',
	duty_station: '',
	line_manager: '',
 	line_manager_id: '',
	start_of_current_contract: moment(new Date()),
	end_of_current_contract: moment(new Date()).add(6, 'M'),
	immap_office: '',
	is_immap_inc: 0,
	is_immap_france: 0,
	errors: {},
	isEdit: false,
	apiURL: '/api/users',
	redirectURL: '/dashboard/users',
	immap_contract_international: 0,
	under_sbp_program: 0,
	showLoading: false,
	role: '',
	project_code: '',
	save_as_history: 0,
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IMMAPER_FORMDATA:
			return {
				...state,
				full_name: action.payload.full_name,
				p11Completed: action.payload.p11Completed,
				immap_email: action.payload.immap_email,
				job_title: action.payload.job_title,
				duty_station: action.payload.duty_station,
				line_manager: action.payload.line_manager,
				line_manager_id: action.payload.line_manager_id,
				start_of_current_contract: action.payload.start_of_current_contract,
				end_of_current_contract: action.payload.end_of_current_contract,
				immap_office: action.payload.immap_office,
				is_immap_inc: action.payload.is_immap_inc,
				is_immap_france: action.payload.is_immap_france,
				profile_id: action.payload.profile_id,
				isEdit: action.payload.isEdit,
				apiURL: action.payload.apiURL,
				redirectURL: action.payload.redirectURL,
				immap_contract_international: action.payload.immap_contract_international,
				under_sbp_program: action.payload.under_sbp_program,
				role: action.payload.role,
				project_code: action.payload.project_code,
				save_as_history: action.payload.save_as_history,
			};
		case SET_IMMAPER_DATA:
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
};
