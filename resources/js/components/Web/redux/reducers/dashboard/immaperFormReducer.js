import {
	SET_DASHBOARD_ALREADY_IMMAPER_FORM,
	SET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM,
	RESET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM
} from '../../types/dashboard/immaperFormTypes';
import moment from 'moment';

const initialState = {
	addImmaper: false,
	users: [],
	user: '',
	errors: {},
	immap_email: '',
	is_immap_inc: 0,
	is_immap_france: 0,
	immap_office: '',
	line_manager: '',
	job_title: '',
	duty_station: '',
	start_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
	end_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
	immap_contract_international: 0,
	under_sbp_program: 0,
	role: '',
	project_code: '',

};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_DASHBOARD_ALREADY_IMMAPER_FORM:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM:
			return {
				...state,
				errors: {},
				is_immaper: action.immaper_data.is_immaper,
				verified_immaper: action.immaper_data.verified_immaper,
				immap_email: action.immaper_data.immap_email,
				is_immap_inc: action.immaper_data.is_immap_inc,
				is_immap_france: action.immaper_data.is_immap_france,
				immap_office: action.immaper_data.immap_office,
				line_manager: action.immaper_data.line_manager,
				job_title: action.immaper_data.job_title,
				duty_station: action.immaper_data.duty_station,
				project_code: action.immaper_data.project_code,
				start_of_current_contract: isEmpty(action.immaper_data.start_of_current_contract)
					? moment(new Date()).format('YYYY-MM-DD')
					: action.immaper_data.start_of_current_contract,
				end_of_current_contract: isEmpty(action.immaper_data.end_of_current_contract)
					? moment(new Date()).format('YYYY-MM-DD')
					: action.immaper_data.end_of_current_contract,

				immap_contract_international: action.immaper_data.immap_contract_international
			};
		case RESET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM:
			return {
				...state,
				user: '',
				errors: {},
				immap_email: '',
				is_immap_inc: 0,
				is_immap_france: 0,
				immap_office: '',
				line_manager: '',
				job_title: '',
				duty_station: '',
				start_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
				end_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
				immap_contract_international: 0,
				project_code: '',
			};

		default:
			return state;
	}
};
